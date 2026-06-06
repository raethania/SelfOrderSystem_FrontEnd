import CustomerLayout from "@/layout/CustomerLayout"
import ProfileHeader from "@/features/profile/components/ProfileHeader"
import { useAuthStore } from "@/store/authStore"
import { Card } from "@/components/ui/card"
import { Mail, Shield, Calendar, Clock } from "lucide-react"

export default function ProfilePage() {
    const user = useAuthStore((state) => state.user)

    return (
        <CustomerLayout title="Profile" subtitle="Your account details">
            <ProfileHeader />

            <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider mt-6">
                Account Information
            </h3>

            {user ? (
                <Card className="p-4 md:p-6 mb-6">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                <Mail size={20} className="text-primary" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Email</p>
                                <p className="text-sm font-medium text-foreground">{user.email}</p>
                            </div>
                        </div>

                        <div className="w-full h-px bg-border" />

                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                <Shield size={20} className="text-primary" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Role</p>
                                <p className="text-sm font-medium text-foreground capitalize">{user.role}</p>
                            </div>
                        </div>

                        <div className="w-full h-px bg-border" />

                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                <Calendar size={20} className="text-primary" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Account Created</p>
                                <p className="text-sm font-medium text-foreground">
                                    {new Date(user.created_at).toLocaleDateString("id-ID", {
                                        day: "numeric", month: "long", year: "numeric"
                                    })}
                                </p>
                            </div>
                        </div>

                        <div className="w-full h-px bg-border" />

                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                <Clock size={20} className="text-primary" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Last Updated</p>
                                <p className="text-sm font-medium text-foreground">
                                    {new Date(user.updated_at).toLocaleDateString("id-ID", {
                                        day: "numeric", month: "long", year: "numeric",
                                        hour: "2-digit", minute: "2-digit"
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>
                </Card>
            ) : (
                <div className="text-center py-10 text-muted-foreground">
                    Memuat data...
                </div>
            )}
        </CustomerLayout>
    )
}
