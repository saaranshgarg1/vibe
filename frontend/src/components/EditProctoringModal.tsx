import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { useEditProctoringSettings } from "@/hooks/hooks"
import { useState } from "react"

enum ProctoringComponent {
  CAMERAMICRO = 'cameraMic',
  BLURDETECTION = 'blurDetection',
  FACECOUNTDETECTION = 'faceCountDetection',
  HANDGESTUREDETECTION = 'handGestureDetection',
  VOICEDETECTION = 'voiceDetection',
  VIRTUALBACKGROUNDDETECTION = 'virtualBackgroundDetection',
  RIGHTCLICKDISABLED = 'rightClickDisabled',
  FACERECOGNITION = 'faceRecognition',
}

const labelMap: Record<string, string> = {
  cameraMic: "Camera + Microphone",
  blurDetection: "Blur Detection",
  faceCountDetection: "Face Count Detection",
  handGestureDetection: "Hand Gesture Detection",
  voiceDetection: "Voice Detection",
  virtualBackgroundDetection: "Virtual Background Detection",
  rightClickDisabled: "Right Click Disabled",
  faceRecognition: "Face Recognition",
}

export function ProctoringModal({
  open,
  onClose,
  courseId,
  courseVersionId,
  isNew,
}: {
  open: boolean
  onClose: () => void
  courseId: string
  courseVersionId: string
  isNew: boolean
}) {
  const { editSettings, loading, error } = useEditProctoringSettings()

  const allComponents = Object.values(ProctoringComponent)
  const [detectors, setDetectors] = useState(
    allComponents.map((name) => ({ name, enabled: false }))
  )

  // (Optional) If you want to prefill existing settings, you can fetch and set them here using useEffect

  const toggle = (name: string) => {
    setDetectors((prev) =>
      prev.map((d) =>
        d.name === name ? { ...d, enabled: !d.enabled } : d
      )
    )
  }

  const handleSubmit = async () => {
    await editSettings(courseId, courseVersionId, detectors, isNew)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-background text-foreground max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-center">
            Proctoring Settings
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSubmit()
          }}
          className="space-y-6 pt-4"
        >
          <div className="space-y-4">
            {detectors.map((detector) => (
              <div key={detector.name} className="flex items-center space-x-2">
                <Checkbox
                  id={detector.name}
                  checked={detector.enabled}
                  onCheckedChange={() => toggle(detector.name)}
                />
                <label
                  htmlFor={detector.name}
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {labelMap[detector.name] || detector.name}
                </label>
              </div>
            ))}
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
