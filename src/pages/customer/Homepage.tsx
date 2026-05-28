import { MenuGrid } from "@/features/menu/components/MenuGrid"
import { CartBar } from "@/features/menu/components/CartBar"
import CustomerLayout from "@/layout/CustomerLayout"




export default function Homepage() {
  const menuItems = Array(8).fill({})

  return (
    <CustomerLayout title="Table 03" subtitle="Find your favorite meal">
      <MenuGrid items={menuItems} />
      <CartBar itemCount={2} itemName="Classic Burger" total="Rp. 17.000" />
    </CustomerLayout>
  )
}