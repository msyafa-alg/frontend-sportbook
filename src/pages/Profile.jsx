import { useContext } from "react";
import { Card, Avatar, Badge, Button } from "flowbite-react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { MdSportsSoccer, MdHistory } from "react-icons/md";

// Profile.jsx : halaman profil user yang sedang login
// sama polanya dengan Profile.jsx di template
export default function Profile() {
    const { user } = useContext(AuthContext);

    if (!user) return null;

    return (
        <div className="min-h-screen bg-white py-8">
            <div className="container mx-auto px-4">
                <div className="max-w-2xl mx-auto">
                    <Card className="text-center">
                        <Avatar
                            img="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                            alt={user.name}
                            size="xl"
                            rounded
                            className="mx-auto mb-4"
                        />
                        <h5 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            {user.name}
                        </h5>
                        <span className="text-sm text-gray-500 dark:text-gray-400 mb-3 block">
                            @{user.username}
                        </span>
                        <Badge color={user.role === "admin" ? "warning" : "info"} className="mb-4">
                            {user.role}
                        </Badge>
                        <div className="space-y-2 mt-4">
                            <Link to="/fields">
                                <Button className="w-full">
                                    <MdSportsSoccer className="w-4 h-4 mr-2" />
                                    Lihat Lapangan
                                </Button>
                            </Link>
                            <br />
                            <Link to="/my-bookings">
                                <Button outline color="gray" className="w-full">
                                    <MdHistory className="w-4 h-4 mr-2" />
                                    Riwayat Booking
                                </Button>
                            </Link>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
