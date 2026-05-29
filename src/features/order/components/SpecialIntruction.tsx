import { Card } from "@/components/ui/card"
import {
    Field,
    FieldDescription,
    FieldLabel,
} from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"
import { useCartStore } from "@/store/cartStore"

export default function SpecialIntruction() {
    const notes = useCartStore((state) => state.notes)
    const setNotes = useCartStore((state) => state.setNotes)

    return (
        <Card className="p-4 mb-4">
            <Field>
                <FieldLabel htmlFor="textarea-message">Special Instruction</FieldLabel>
                <FieldDescription>Enter your message below.</FieldDescription>
                <Textarea
                    id="textarea-message"
                    placeholder="e.g. No onions, extra cheese..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                />
            </Field>
        </Card>
    )
}
