import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { lazy, Suspense, useContext } from "react";
import ProtectedRoute from "./Components/ProtectedRoute";
import { AuthContext } from "./Context/AuthContext";
import { DarkModeContext } from "./Context/darkModeContext";

// Lazy load pages for code splitting
const Home = lazy(() => import("./Pages/Home/home"));
const List = lazy(() => import("./Pages/List/list"));
const Login = lazy(() => import("./Pages/Login/login"));
const New = lazy(() => import("./Pages/New/new"));
const Single = lazy(() => import("./Pages/Single/single"));
const InternList = lazy(() => import("./Pages/InternList/InternList"));
const InternSingle = lazy(() => import("./Pages/InternSingle/InternSingle"));
const InternNew = lazy(() => import("./Pages/InternNew/InternNew"));
const TeamPayout = lazy(() => import("./Pages/TeamPayout/TeamPayout"));
const InternPayout = lazy(() => import("./Pages/InternPayout/InternPayout"));
const FinancialOverview = lazy(() => import("./Pages/FinancialOverview/FinancialOverview"));
const TaskDashboard = lazy(() => import("./Pages/TaskDashboard/TaskDashboard"));
const TaskDetail = lazy(() => import("./Pages/TaskDetail/TaskDetail"));
const TaskNew = lazy(() => import("./Pages/TaskNew/TaskNew"));
const TaskTimeline = lazy(() => import("./Components/TaskTimeline/TaskTimeline"));
const TaskCost = lazy(() => import("./Components/TaskCost/TaskCost"));

// Educational Content Pages
const LearnCenter = lazy(() => import("./Pages/LearnCenter/LearnCenter"));
const CourseModule = lazy(() => import("./Pages/CourseModule/CourseModule"));
const Resources = lazy(() => import("./Pages/Resources/Resources"));
const Help = lazy(() => import("./Pages/Help/Help"));

// Interactive Tools
const BusinessModelCanvas = lazy(() => import("./Components/Tools/BusinessModelCanvas"));
const StartupCalculator = lazy(() => import("./Components/Tools/StartupCalculator"));
const PitchDeckBuilder = lazy(() => import("./Components/Tools/PitchDeckBuilder"));

// Loading component
const LoadingFallback = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontSize: '1.5rem'
  }}>
    Loading...
  </div>
);

function App() {
  const { isAuthenticated } = useContext(AuthContext);
  const { darkMode } = useContext(DarkModeContext);

  return (
    <div className={darkMode ? "app dark" : "app"}>
      <BrowserRouter>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* Public route - Login */}
            <Route
              path="/login"
              element={
                isAuthenticated ? <Navigate to="/" replace /> : <Login />
              }
            />

            {/* Protected routes */}
            <Route path="/">
              <Route
                index
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                }
              />
              <Route path="user">
                <Route
                  index
                  element={
                    <ProtectedRoute>
                      <List />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path=":userId"
                  element={
                    <ProtectedRoute>
                      <Single />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="new"
                  element={
                    <ProtectedRoute>
                      <New title="Add New User" />
                    </ProtectedRoute>
                  }
                />
              </Route>
              <Route path="products">
                <Route
                  index
                  element={
                    <ProtectedRoute>
                      <List />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path=":productId"
                  element={
                    <ProtectedRoute>
                      <Single />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="new"
                  element={
                    <ProtectedRoute>
                      <New title="Add New Product" />
                    </ProtectedRoute>
                  }
                />
              </Route>
              <Route path="interns">
                <Route
                  index
                  element={
                    <ProtectedRoute>
                      <InternList />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path=":internId"
                  element={
                    <ProtectedRoute>
                      <InternSingle />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="new"
                  element={
                    <ProtectedRoute>
                      <InternNew />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="edit/:internId"
                  element={
                    <ProtectedRoute>
                      <InternNew />
                    </ProtectedRoute>
                  }
                />
              </Route>
              {/* Financial Routes */}
              <Route
                path="team-payout"
                element={
                  <ProtectedRoute>
                    <TeamPayout />
                  </ProtectedRoute>
                }
              />
              <Route
                path="intern-payout"
                element={
                  <ProtectedRoute>
                    <InternPayout />
                  </ProtectedRoute>
                }
              />
              <Route
                path="financial-overview"
                element={
                  <ProtectedRoute>
                    <FinancialOverview />
                  </ProtectedRoute>
                }
              />
              {/* Task Management Routes */}
              <Route path="tasks">
                <Route
                  index
                  element={
                    <ProtectedRoute>
                      <TaskDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path=":taskId"
                  element={
                    <ProtectedRoute>
                      <TaskDetail />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="new"
                  element={
                    <ProtectedRoute>
                      <TaskNew />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="edit/:taskId"
                  element={
                    <ProtectedRoute>
                      <TaskNew />
                    </ProtectedRoute>
                  }
                />
              </Route>
              <Route
                path="task-timeline"
                element={
                  <ProtectedRoute>
                    <TaskTimeline />
                  </ProtectedRoute>
                }
              />
              <Route
                path="task-cost"
                element={
                  <ProtectedRoute>
                    <TaskCost />
                  </ProtectedRoute>
                }
              />

              {/* Educational Content Routes */}
              <Route
                path="learn"
                element={
                  <ProtectedRoute>
                    <LearnCenter />
                  </ProtectedRoute>
                }
              />
              <Route
                path="learn/module/:moduleId"
                element={
                  <ProtectedRoute>
                    <CourseModule />
                  </ProtectedRoute>
                }
              />
              <Route
                path="resources"
                element={
                  <ProtectedRoute>
                    <Resources />
                  </ProtectedRoute>
                }
              />
              <Route
                path="help"
                element={
                  <ProtectedRoute>
                    <Help />
                  </ProtectedRoute>
                }
              />

              {/* Interactive Tools Routes */}
              <Route
                path="tools/business-model-canvas"
                element={
                  <ProtectedRoute>
                    <BusinessModelCanvas />
                  </ProtectedRoute>
                }
              />
              <Route
                path="tools/calculators"
                element={
                  <ProtectedRoute>
                    <StartupCalculator />
                  </ProtectedRoute>
                }
              />
              <Route
                path="tools/pitch-deck-builder"
                element={
                  <ProtectedRoute>
                    <PitchDeckBuilder />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Catch all - redirect to home or login */}
            <Route
              path="*"
              element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />}
            />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </div>
  );
}

export default App;
