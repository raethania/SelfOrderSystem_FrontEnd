import CustomerLayout from "@/layout/CustomerLayout"
import ProfileHeader from "@/features/profile/components/ProfileHeader"
import ProfileStats from "@/features/profile/components/ProfileStats"
import ProfileMenu from "@/features/profile/components/ProfileMenu"
import LogoutButton from "@/features/profile/components/LogoutButton"

export default function ProfilePage() {
    return (
        <CustomerLayout title="Profile" subtitle="Manage your account settings">
            <ProfileHeader />
            <ProfileStats />
            <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
                Settings
            </h3>
            <ProfileMenu />
            <LogoutButton />
        </CustomerLayout>
    )
}
