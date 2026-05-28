import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function MenuCard() {
  return (
    <Card className="relative mx-auto w-full max-w-sm pt-0">
      <div className="absolute inset-0 z-30 aspect-video bg-black/35" />
      <img
        src="https://avatar.vercel.sh/shadcn1"
        alt="Event cover"
        className="relative z-20 aspect-video w-full object-cover brightness-60 grayscale dark:brightness-40"
      />
      <CardHeader>
        <CardTitle>Design systems meetup</CardTitle>
        <CardDescription>
          Grilled beef patty with lettuce and cheese
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex justify-end">
        <Button className="rounded-full w-7 h-7">+</Button>
      </CardFooter>
    </Card>
  )
}
