import { useEffect, useState } from "react";
import { fetchActivityLogs } from "./api";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Logs() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadLogs() {
            try {
                const data = await fetchActivityLogs();
                setLogs(data.logs || data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        loadLogs();
    }, []);

    if (loading) return <p className="p-6">Loading logs…</p>;
    if (error) return <p className="text-red-500 p-6">{error}</p>;

    return (
        <Card className="mt-6">
            <CardHeader>
                <CardTitle>Activity Logs</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Action</TableHead>
                            <TableHead>Entity</TableHead>
                            <TableHead>IP</TableHead>
                            <TableHead>Time</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {logs.map((log) => (
                            <TableRow key={log.id}>
                                <TableCell>{log.user_id}</TableCell>
                                <TableCell>{log.action}</TableCell>
                                <TableCell>{log.entity}</TableCell>
                                <TableCell>{log.ip_address || "-"}</TableCell>
                                <TableCell>
                                    {new Date(log.created_at).toLocaleString()}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
