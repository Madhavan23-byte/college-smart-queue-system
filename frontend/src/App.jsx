import { useEffect, useState } from "react";
import axios from "axios";
import logo from "./assets/cit-logo.png";
import "./App.css";

const API_URL = "http://localhost:6001";

function App() {
  const [activeTab, setActiveTab] = useState("login");
  const [listMode, setListMode] = useState("active");
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    department: "B.E. Computer Science & Engineering",
    assignedService: "Overall Admin"
  });

  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });

  const [requestData, setRequestData] = useState({
    userName: "",
    role: "student",
    service: "Xerox Shop",
    purpose: "",
    timeSlot: "8:30 AM - 9:30 AM"
  });

  const [permissionTimes, setPermissionTimes] = useState({
    tutor: "8:30 AM - 9:30 AM",
    seniorTutor: "9:30 AM - 10:30 AM",
    hod: "10:30 AM - 11:30 AM"
  });

  const [requests, setRequests] = useState([]);
  const [message, setMessage] = useState("");

  const closedStatuses = ["Completed", "Rejected", "Cancelled"];

  const studentDepartments = [
    "B.E. Civil Engineering",
    "B.E. Computer Science & Engineering",
    "B.E. Electrical & Electronics Engineering",
    "B.E. Electronics & Communication Engineering",
    "B.E. Mechanical Engineering",
    "B.Tech. Information Technology",
    "B.Tech. Artificial Intelligence and Data Science",
    "B.Tech. Chemical Engineering",
    "M.Sc. Software Systems",
    "M.Sc. Data Science",
    "M.Sc. Decision and Computing Sciences",
    "M.Sc. Artificial Intelligence and Machine Learning",
    "Business Administration (MBA)",
    "Computer Application (MCA)"
  ];

  const professorDepartments = [
    "B.E. Civil Engineering",
    "B.E. Computer Science & Engineering",
    "B.E. Electrical & Electronics Engineering",
    "B.E. Electronics & Communication Engineering",
    "B.E. Mechanical Engineering",
    "B.Tech. Information Technology",
    "B.Tech. Artificial Intelligence and Data Science",
    "B.Tech. Chemical Engineering",
    "M.Sc. Software Systems",
    "M.Sc. Data Science",
    "M.Sc. Decision and Computing Sciences",
    "M.Sc. Artificial Intelligence and Machine Learning",
    "Business Administration (MBA)",
    "Computer Application (MCA)",
    "Mathematics",
    "Physics",
    "Chemistry",
    "Humanities",
    "Library"
  ];

  const studentServices = [
    "Xerox Shop",
    "No-Due Form - Accounts Section",
    "No-Due Form - Library Section",
    "Permission Letter Signing"
  ];

  const professorServices = ["Principal Meeting", "Xerox Shop"];

  const adminServices = [
    "Overall Admin",
    "Xerox Shop",
    "No-Due Form - Accounts Section",
    "No-Due Form - Library Section",
    "Permission Letter Signing",
    "Principal Meeting"
  ];

  const commonTimeSlots = [
    "8:30 AM - 9:30 AM",
    "9:30 AM - 10:30 AM",
    "10:30 AM - 11:30 AM",
    "11:30 AM - 12:30 PM",
    "1:30 PM - 2:30 PM",
    "2:30 PM - 3:30 PM",
    "3:30 PM - 4:30 PM",
    "4:30 PM - 5:00 PM"
  ];

  const principalMeetingSlots = [
    "9:00 AM - 10:00 AM",
    "10:00 AM - 11:00 AM",
    "11:00 AM - 12:00 PM",
    "1:00 PM - 2:00 PM",
    "2:00 PM - 3:00 PM",
    "3:00 PM - 4:00 PM",
    "4:00 PM - 4:30 PM"
  ];

  const getDepartmentsByRole = (role) => {
    if (role === "professor") {
      return professorDepartments;
    }

    return studentDepartments;
  };

  const getServicesByRole = (role) => {
    if (role === "professor") {
      return professorServices;
    }

    return studentServices;
  };

  const getTimeSlotsByService = (service) => {
    if (service === "Principal Meeting") {
      return principalMeetingSlots;
    }

    return commonTimeSlots;
  };

  const isPermissionLetter = requestData.service === "Permission Letter Signing";

  const getErrorMessage = (error, defaultMessage) => {
    if (error.response && error.response.data && error.response.data.message) {
      return error.response.data.message;
    }

    if (error.response && error.response.data && error.response.data.error) {
      return error.response.data.error;
    }

    if (error.message) {
      return error.message;
    }

    return defaultMessage;
  };

  const getRoleBasedRequests = () => {
    if (!user) {
      return [];
    }

    if (user.role === "admin") {
      if (user.assignedService === "Overall Admin") {
        return requests;
      }

      return requests.filter((item) => item.service === user.assignedService);
    }

    return requests.filter(
      (item) => item.role === user.role && item.service === requestData.service
    );
  };

  const getVisibleRequests = () => {
    const roleBasedRequests = getRoleBasedRequests();

    if (listMode === "history") {
      return roleBasedRequests.filter((item) =>
        closedStatuses.includes(item.status)
      );
    }

    return roleBasedRequests.filter(
      (item) => !closedStatuses.includes(item.status)
    );
  };

  const visibleRequests = getVisibleRequests();

  const getListTitle = () => {
    let title = "Service Requests";

    if (user?.role === "admin") {
      title =
        user.assignedService === "Overall Admin"
          ? "All Service Requests"
          : `${user.assignedService} Requests`;
    } else if (user) {
      title = `${requestData.service} Requests`;
    }

    return listMode === "history" ? `${title} - History` : `${title} - Active`;
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!registerData.name || !registerData.email || !registerData.password) {
      setMessage("All fields are required");
      return;
    }

    const finalRegisterData = {
      ...registerData,
      department:
        registerData.role === "admin" ? "Admin Office" : registerData.department,
      assignedService:
        registerData.role === "admin" ? registerData.assignedService : "None"
    };

    try {
      const res = await axios.post(
        `${API_URL}/api/auth/register`,
        finalRegisterData
      );

      setMessage(res.data.message);
      setActiveTab("login");

      setRegisterData({
        name: "",
        email: "",
        password: "",
        role: "student",
        department: "B.E. Computer Science & Engineering",
        assignedService: "Overall Admin"
      });
    } catch (error) {
      setMessage(getErrorMessage(error, "Registration failed"));
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!loginData.email || !loginData.password) {
      setMessage("Email and password are required");
      return;
    }

    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, loginData);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.data));

      const loggedUser = res.data.data;
      const firstService = getServicesByRole(loggedUser.role)[0];
      const firstTimeSlot = getTimeSlotsByService(firstService)[0];

      setToken(res.data.token);
      setUser(loggedUser);
      setMessage(res.data.message);
      setListMode("active");

      setRequestData({
        userName: loggedUser.name,
        role: loggedUser.role,
        service: firstService,
        purpose: "",
        timeSlot: firstTimeSlot
      });

      setActiveTab("dashboard");
    } catch (error) {
      setMessage(getErrorMessage(error, "Login failed"));
    }
  };

  const fetchRequests = async () => {
    if (!token) {
      return;
    }

    try {
      const res = await axios.get(`${API_URL}/api/requests`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setRequests(res.data.data);
    } catch (error) {
      setMessage(getErrorMessage(error, "Error fetching requests"));
    }
  };

  const handleServiceChange = (e) => {
    const selectedService = e.target.value;
    const firstTimeSlot = getTimeSlotsByService(selectedService)[0];

    setListMode("active");

    setRequestData({
      ...requestData,
      service: selectedService,
      timeSlot: firstTimeSlot
    });

    if (selectedService === "Permission Letter Signing") {
      setPermissionTimes({
        tutor: "8:30 AM - 9:30 AM",
        seniorTutor: "9:30 AM - 10:30 AM",
        hod: "10:30 AM - 11:30 AM"
      });
    }
  };

  const handleBookRequest = async (e) => {
    e.preventDefault();

    if (!requestData.purpose) {
      setMessage("Purpose is required");
      return;
    }

    let finalRequestData = { ...requestData };

    if (isPermissionLetter) {
      finalRequestData = {
        ...requestData,
        timeSlot: `Tutor: ${permissionTimes.tutor}, Senior Tutor: ${permissionTimes.seniorTutor}, HOD: ${permissionTimes.hod}`
      };
    }

    try {
      const res = await axios.post(`${API_URL}/api/requests`, finalRequestData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setMessage(res.data.message);
      setListMode("active");

      setRequestData({
        ...requestData,
        purpose: "",
        timeSlot: getTimeSlotsByService(requestData.service)[0]
      });

      setPermissionTimes({
        tutor: "8:30 AM - 9:30 AM",
        seniorTutor: "9:30 AM - 10:30 AM",
        hod: "10:30 AM - 11:30 AM"
      });

      fetchRequests();
    } catch (error) {
      setMessage(getErrorMessage(error, "Request booking failed"));
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const res = await axios.put(
        `${API_URL}/api/requests/${id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setMessage(res.data.message);
      fetchRequests();
    } catch (error) {
      setMessage(getErrorMessage(error, "Status update failed"));
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken("");
    setUser(null);
    setRequests([]);
    setMessage("Logged out successfully");
    setListMode("active");
    setActiveTab("login");
  };

  useEffect(() => {
    if (token && user) {
      fetchRequests();

      const firstService = getServicesByRole(user.role)[0];
      const firstTimeSlot = getTimeSlotsByService(firstService)[0];

      setRequestData({
        userName: user.name,
        role: user.role,
        service: firstService,
        purpose: "",
        timeSlot: firstTimeSlot
      });
    }
  }, [token]);

  return (
    <div className="app">
      <header className="top-section">
        <div className="header-box">
          <img src={logo} alt="CIT Logo" className="college-logo" />
          <h1>College Smart Queue & Slot Booking System</h1>
        </div>

        {user && (
          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        )}
      </header>

      {message && <div className="message-box">{message}</div>}

      {!user && (
        <div className="auth-card">
          <div className="tab-buttons">
            <button
              className={activeTab === "login" ? "tab active-tab" : "tab"}
              onClick={() => setActiveTab("login")}
            >
              Login
            </button>

            <button
              className={activeTab === "register" ? "tab active-tab" : "tab"}
              onClick={() => setActiveTab("register")}
            >
              Register
            </button>
          </div>

          {activeTab === "login" && (
            <form onSubmit={handleLogin} className="form-box">
              <h2>User Login</h2>

              <input
                type="email"
                placeholder="Email"
                value={loginData.email}
                onChange={(e) =>
                  setLoginData({ ...loginData, email: e.target.value })
                }
              />

              <input
                type="password"
                placeholder="Password"
                value={loginData.password}
                onChange={(e) =>
                  setLoginData({ ...loginData, password: e.target.value })
                }
              />

              <button type="submit">Login</button>
            </form>
          )}

          {activeTab === "register" && (
            <form onSubmit={handleRegister} className="form-box">
              <h2>User Registration</h2>

              <input
                type="text"
                placeholder="Full Name"
                value={registerData.name}
                onChange={(e) =>
                  setRegisterData({ ...registerData, name: e.target.value })
                }
              />

              <input
                type="email"
                placeholder="Email"
                value={registerData.email}
                onChange={(e) =>
                  setRegisterData({ ...registerData, email: e.target.value })
                }
              />

              <input
                type="password"
                placeholder="Password"
                value={registerData.password}
                onChange={(e) =>
                  setRegisterData({
                    ...registerData,
                    password: e.target.value
                  })
                }
              />

              <select
                value={registerData.role}
                onChange={(e) => {
                  const selectedRole = e.target.value;

                  setRegisterData({
                    ...registerData,
                    role: selectedRole,
                    department:
                      selectedRole === "admin"
                        ? "Admin Office"
                        : getDepartmentsByRole(selectedRole)[0],
                    assignedService:
                      selectedRole === "admin" ? "Overall Admin" : "None"
                  });
                }}
              >
                <option value="student">Student</option>
                <option value="professor">Professor</option>
                <option value="admin">Admin</option>
              </select>

              {registerData.role !== "admin" && (
                <select
                  value={registerData.department}
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      department: e.target.value
                    })
                  }
                >
                  {getDepartmentsByRole(registerData.role).map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              )}

              {registerData.role === "admin" && (
                <select
                  value={registerData.assignedService}
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      assignedService: e.target.value
                    })
                  }
                >
                  {adminServices.map((service) => (
                    <option key={service} value={service}>
                      {service}
                    </option>
                  ))}
                </select>
              )}

              <button type="submit">Register</button>
            </form>
          )}
        </div>
      )}

      {user && (
        <main className="dashboard">
          <section className="user-card">
            <h2>Welcome, {user.name}</h2>
            <p>
              <b>Role:</b> {user.role}
            </p>
            <p>
              <b>Department:</b> {user.department}
            </p>

            {user.role === "admin" && (
              <p>
                <b>Assigned Service:</b> {user.assignedService}
              </p>
            )}
          </section>

          {user.role !== "admin" && (
            <section className="request-card">
              <h2>Book Service Request</h2>

              <form onSubmit={handleBookRequest} className="request-form">
                <input type="text" value={requestData.userName} readOnly />

                <input type="text" value={requestData.role} readOnly />

                <select value={requestData.service} onChange={handleServiceChange}>
                  {getServicesByRole(user.role).map((service) => (
                    <option key={service} value={service}>
                      {service}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  placeholder={
                    isPermissionLetter
                      ? "Reason for permission letter"
                      : "Purpose"
                  }
                  value={requestData.purpose}
                  onChange={(e) =>
                    setRequestData({
                      ...requestData,
                      purpose: e.target.value
                    })
                  }
                />

                {!isPermissionLetter && (
                  <select
                    value={requestData.timeSlot}
                    onChange={(e) =>
                      setRequestData({
                        ...requestData,
                        timeSlot: e.target.value
                      })
                    }
                  >
                    {getTimeSlotsByService(requestData.service).map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                )}

                {isPermissionLetter && (
                  <>
                    <select
                      value={permissionTimes.tutor}
                      onChange={(e) =>
                        setPermissionTimes({
                          ...permissionTimes,
                          tutor: e.target.value
                        })
                      }
                    >
                      {commonTimeSlots.map((slot) => (
                        <option key={slot} value={slot}>
                          Tutor Signing - {slot}
                        </option>
                      ))}
                    </select>

                    <select
                      value={permissionTimes.seniorTutor}
                      onChange={(e) =>
                        setPermissionTimes({
                          ...permissionTimes,
                          seniorTutor: e.target.value
                        })
                      }
                    >
                      {commonTimeSlots.map((slot) => (
                        <option key={slot} value={slot}>
                          Senior Tutor Signing - {slot}
                        </option>
                      ))}
                    </select>

                    <select
                      value={permissionTimes.hod}
                      onChange={(e) =>
                        setPermissionTimes({
                          ...permissionTimes,
                          hod: e.target.value
                        })
                      }
                    >
                      {commonTimeSlots.map((slot) => (
                        <option key={slot} value={slot}>
                          HOD Signing - {slot}
                        </option>
                      ))}
                    </select>
                  </>
                )}

                <button type="submit">Book Request</button>
              </form>
            </section>
          )}

          <section className="list-card">
            <div className="list-title">
              <h2>{getListTitle()}</h2>

              <button onClick={fetchRequests}>Refresh</button>
            </div>

            <div className="history-buttons">
              <button
                className={listMode === "active" ? "history-active" : ""}
                onClick={() => setListMode("active")}
              >
                Active Requests
              </button>

              <button
                className={listMode === "history" ? "history-active" : ""}
                onClick={() => setListMode("history")}
              >
                History
              </button>
            </div>

            <div className="table-area">
              <table>
                <thead>
                  <tr>
                    <th>Token</th>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Service</th>
                    <th>Purpose</th>
                    <th>Time Slot</th>
                    <th>Status</th>
                    {user.role === "admin" && <th>Update</th>}
                  </tr>
                </thead>

                <tbody>
                  {visibleRequests.length === 0 && (
                    <tr>
                      <td
                        colSpan={user.role === "admin" ? "8" : "7"}
                        className="empty-row"
                      >
                        No requests found
                      </td>
                    </tr>
                  )}

                  {visibleRequests.map((item) => (
                    <tr key={item._id}>
                      <td>{item.tokenNumber}</td>
                      <td>{item.userName}</td>
                      <td>{item.role}</td>
                      <td>{item.service}</td>
                      <td>{item.purpose}</td>
                      <td>{item.timeSlot}</td>
                      <td>
                        <span className={`status ${item.status.toLowerCase()}`}>
                          {item.status}
                        </span>
                      </td>

                      {user.role === "admin" && (
                        <td>
                          <select
                            value={item.status}
                            onChange={(e) =>
                              updateStatus(item._id, e.target.value)
                            }
                          >
                            <option value="Waiting">Waiting</option>
                            <option value="Processing">Processing</option>
                            <option value="Called">Called</option>
                            <option value="Approved">Approved</option>
                            <option value="Rejected">Rejected</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      )}
    </div>
  );
}

export default App;