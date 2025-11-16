#!/bin/bash

# Security Fixes Script for Startup Dashboard App
# This script helps fix critical security issues

set -e  # Exit on error

echo "======================================"
echo "Security Fixes Script"
echo "======================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "ℹ $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root."
    exit 1
fi

echo "Current directory: $(pwd)"
echo ""

# 1. Remove .env files from git tracking
echo "======================================"
echo "1. Removing .env files from git tracking"
echo "======================================"
echo ""

if git ls-files | grep -E "\.env\.production|\.env\.development" > /dev/null; then
    print_warning ".env files are tracked in git. Removing..."

    git rm --cached .env.production 2>/dev/null || true
    git rm --cached .env.development 2>/dev/null || true

    # Check if files were removed
    if ! git ls-files | grep -E "\.env\.production|\.env\.development" > /dev/null; then
        print_success ".env files removed from git tracking"

        # Check if there are changes to commit
        if git diff --cached --quiet; then
            print_info "No changes to commit (files may not have been tracked)"
        else
            print_warning "Changes staged. You need to commit these changes:"
            echo ""
            echo "  git commit -m 'security: Remove environment files from git tracking'"
            echo ""
        fi
    else
        print_error "Failed to remove .env files from git tracking"
    fi
else
    print_success ".env files are not tracked in git"
fi

echo ""

# 2. Verify .gitignore
echo "======================================"
echo "2. Verifying .gitignore"
echo "======================================"
echo ""

if grep -q "^\.env\.production$" .gitignore && grep -q "^\.env\.development$" .gitignore; then
    print_success ".gitignore properly configured"
else
    print_warning ".gitignore may need updating"
    print_info "Check .gitignore file to ensure it contains:"
    echo "  .env.production"
    echo "  .env.development"
fi

echo ""

# 3. Check npm vulnerabilities
echo "======================================"
echo "3. Checking npm vulnerabilities"
echo "======================================"
echo ""

if command -v npm > /dev/null; then
    print_info "Running npm audit..."

    # Run npm audit and capture output
    if npm audit --json > /tmp/npm-audit.json 2>&1; then
        print_success "No vulnerabilities found"
    else
        # Count vulnerabilities by severity
        critical=$(jq '.metadata.vulnerabilities.critical // 0' /tmp/npm-audit.json 2>/dev/null || echo "0")
        high=$(jq '.metadata.vulnerabilities.high // 0' /tmp/npm-audit.json 2>/dev/null || echo "0")
        moderate=$(jq '.metadata.vulnerabilities.moderate // 0' /tmp/npm-audit.json 2>/dev/null || echo "0")

        print_warning "Vulnerabilities found:"
        echo "  Critical: $critical"
        echo "  High: $high"
        echo "  Moderate: $moderate"
        echo ""
        print_info "Run 'npm audit fix' to fix automatically fixable vulnerabilities"
        print_info "Run 'npm audit fix --force' to fix all vulnerabilities (may cause breaking changes)"
    fi

    rm -f /tmp/npm-audit.json
else
    print_warning "npm not found. Skipping vulnerability check."
fi

echo ""

# 4. Install crypto-js for encryption
echo "======================================"
echo "4. Checking encryption dependency"
echo "======================================"
echo ""

if grep -q '"crypto-js"' package.json; then
    print_success "crypto-js is already installed"
else
    print_warning "crypto-js not found in package.json"
    read -p "Install crypto-js? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        npm install crypto-js
        print_success "crypto-js installed"
    else
        print_info "Skipping crypto-js installation"
    fi
fi

echo ""

# 5. Check for console.log in production code
echo "======================================"
echo "5. Checking for console.log in source code"
echo "======================================"
echo ""

console_logs=$(grep -r "console\.\(log\|debug\|info\)" src/ --exclude-dir=__tests__ --exclude="*.test.js" --exclude="logger.js" | wc -l)

if [ "$console_logs" -gt 0 ]; then
    print_warning "Found $console_logs console.log/debug/info statements"
    print_info "Consider replacing with the logger utility"
    echo ""
    print_info "Top files with console statements:"
    grep -r "console\.\(log\|debug\|info\)" src/ --exclude-dir=__tests__ --exclude="*.test.js" --exclude="logger.js" -l | head -5
else
    print_success "No console.log statements found"
fi

echo ""

# 6. Check for hardcoded secrets
echo "======================================"
echo "6. Checking for potential hardcoded secrets"
echo "======================================"
echo ""

secrets=$(grep -rEi "(api[_-]?key|secret|password|token).*=.*['\"][^'\"]{20,}" src/ --exclude-dir=__tests__ --exclude="*.test.js" | grep -v "CHANGE-THIS" | wc -l)

if [ "$secrets" -gt 0 ]; then
    print_warning "Found potential hardcoded secrets (review manually):"
    grep -rEi "(api[_-]?key|secret|password|token).*=.*['\"][^'\"]{20,}" src/ --exclude-dir=__tests__ --exclude="*.test.js" | grep -v "CHANGE-THIS" | head -5
else
    print_success "No obvious hardcoded secrets found"
fi

echo ""

# 7. Check for dangerouslySetInnerHTML
echo "======================================"
echo "7. Checking for dangerouslySetInnerHTML"
echo "======================================"
echo ""

dangerous_html=$(grep -r "dangerouslySetInnerHTML" src/ | wc -l)

if [ "$dangerous_html" -gt 0 ]; then
    print_warning "Found $dangerous_html uses of dangerouslySetInnerHTML"
    print_info "Ensure all uses are properly sanitized with DOMPurify"
else
    print_success "No dangerouslySetInnerHTML found"
fi

echo ""

# 8. Generate security summary
echo "======================================"
echo "Security Summary"
echo "======================================"
echo ""

print_info "Critical Actions Required:"
echo "  1. Remove .env files from git history (if they contained secrets)"
echo "  2. Commit changes to remove .env from tracking"
echo "  3. Replace demo authentication with real implementation"
echo "  4. Update npm packages: npm audit fix"
echo "  5. Implement encryption for localStorage data"
echo "  6. Replace console.log with logger utility"
echo ""

print_info "Documentation Created:"
echo "  ✓ SECURITY.md - Security policy and best practices"
echo "  ✓ SECURITY_CHECKLIST.md - Detailed remediation steps"
echo "  ✓ VULNERABILITY_REPORT.md - Detailed vulnerability report"
echo ""

print_info "Security Utilities Created:"
echo "  ✓ src/utils/encryption.js - Data encryption"
echo "  ✓ src/utils/csrf.js - CSRF protection"
echo "  ✓ src/utils/logger.js - Environment-aware logging"
echo ""

print_warning "Next Steps:"
echo "  1. Review VULNERABILITY_REPORT.md for detailed findings"
echo "  2. Follow SECURITY_CHECKLIST.md for remediation"
echo "  3. Read SECURITY.md for security best practices"
echo "  4. Test all security fixes thoroughly"
echo "  5. Schedule follow-up security audit"
echo ""

print_info "For questions, refer to SECURITY.md or contact the security team."
echo ""

print_success "Security audit complete!"
