import { useEffect, useState } from "react";
import { apiRequest } from "./api";
import { Button } from "@/components/ui/button";
import Logs from "./Logs";
import { toggleTheme, getTheme } from "./theme";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(
    Boolean(localStorage.getItem("token"))
  );

  function logout() {
    localStorage.removeItem("token");
    setLoggedIn(false);
  }

  if (!loggedIn) {
    return <Login onLogin={() => setLoggedIn(true)} />;
  }

  return <Dashboard onLogout={logout} />;
}

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setError("");

    try {
      const data = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      localStorage.setItem("token", data.token);
      onLogin();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Admin Login</CardTitle>
        </CardHeader>
        <CardContent>
          {error && <p className="text-red-500 mb-2">{error}</p>}

          <form onSubmit={handleLogin} className="space-y-3">
            <input
              className="w-full border px-3 py-2"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              className="w-full border px-3 py-2"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button className="w-full">Login</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function Dashboard({ onLogout }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [theme, setTheme] = useState(getTheme());

  async function loadUsers() {
    try {
      const data = await apiRequest("/users");
      setUsers(data.users);
    } catch (err) {
      // TOKEN EXPIRED → LOGOUT
      if (err.message.includes("expired")) {
        onLogout();
        return;
      }
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  loadUsers();
  useEffect(() => {
  }, []);


  async function toggleUser(u) {
    await apiRequest(`/users/${u.id}`, {
      method: "PUT",
      body: JSON.stringify({ is_active: !u.is_active }),
    });

    setUsers((prev) =>
      prev.map((x) =>
        x.id === u.id ? { ...x, is_active: !x.is_active } : x
      )
    );
  }

  if (loading) return <p className="p-6">Loading users…</p>;
  if (error) return <p className="text-red-500 p-6">{error}</p>;

  return (
    <div className="bg-background text-foreground  p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Users</h1>
        <Button
          variant="outline"
          onClick={() => {
            toggleTheme();
            setTheme(getTheme());
          }}
        >
          {theme === "dark" ? "Light mode" : "Dark mode"}
        </Button>

        <Button variant="outline" onClick={onLogout}>
          Logout
        </Button>
      </div>

      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Active</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>{u.role}</TableCell>
                  <TableCell>{u.is_active ? "Yes" : "No"}</TableCell>
                  <TableCell>
                    {new Date(u.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant={u.is_active ? "destructive" : "default"}
                      onClick={() => toggleUser(u)}
                    >
                      {u.is_active ? "Deactivate" : "Activate"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Logs />
    </div>
  );
}
