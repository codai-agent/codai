import React, { ReactNode } from "react"
<<<<<<< HEAD
=======
import { cn } from "@/utils/cn"
>>>>>>> 16bc1c863785d2e3350bd9c2baa4bc31be43087d
import { VSCodeButton } from "@vscode/webview-ui-toolkit/react"
import { AlertTriangle } from "lucide-react"
import { OPENROUTER_MODEL_PICKER_Z_INDEX } from "../settings/OpenRouterModelPicker"

interface AlertDialogProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	children: ReactNode
}

export function AlertDialog({ open, onOpenChange, children }: AlertDialogProps) {
	if (!open) return null

	// Close the dialog when clicking on the backdrop
	const handleBackdropClick = (e: React.MouseEvent) => {
		if (e.target === e.currentTarget) {
			onOpenChange(false)
		}
	}

	return (
		<div
<<<<<<< HEAD
			className={`fixed inset-0 bg-black/50 flex items-center justify-center`}
=======
			className={cn(`fixed inset-0 bg-black/50 flex items-center justify-center`)}
>>>>>>> 16bc1c863785d2e3350bd9c2baa4bc31be43087d
			onClick={handleBackdropClick}
			style={{ zIndex: OPENROUTER_MODEL_PICKER_Z_INDEX + 50 }}>
			{children}
		</div>
	)
}

export function AlertDialogContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
	return (
		<div
<<<<<<< HEAD
			className={`fixed top-[50%] left-[50%] grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] ${className}`}
			onClick={(e) => e.stopPropagation()}
			{...props}>
			<div className="bg-[var(--vscode-editor-background)] rounded-sm gap-3 border border-[var(--vscode-panel-border)] p-6 shadow-lg sm:max-w-lg">
=======
			className={cn(
				`fixed top-[50%] left-[50%] grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%]`,
				className,
			)}
			onClick={(e) => e.stopPropagation()}
			{...props}>
			<div className="bg-[var(--vscode-editor-background)] rounded-sm  gap-3 border border-[var(--vscode-panel-border)] p-4 shadow-lg sm:max-w-md">
>>>>>>> 16bc1c863785d2e3350bd9c2baa4bc31be43087d
				{children}
			</div>
		</div>
	)
}

export function AlertDialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
<<<<<<< HEAD
	return <div className={`flex flex-col gap-1 text-left ${className}`} {...props} />
}

export function AlertDialogFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
	return <div className={`flex flex-row justify-end gap-3 mt-6 ${className}`} {...props} />
=======
	return <div className={cn("flex flex-col gap-1 text-left", className)} {...props} />
}

export function AlertDialogFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
	return <div className={cn("flex flex-row justify-end gap-2 mt-4", className)} {...props} />
>>>>>>> 16bc1c863785d2e3350bd9c2baa4bc31be43087d
}

export function AlertDialogTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
	return (
		<h2
<<<<<<< HEAD
			className={`text-base font-medium text-[var(--vscode-editor-foreground)] flex items-center gap-2 text-left ${className}`}
=======
			className={cn(
				"text-base font-medium text-[var(--vscode-editor-foreground)] flex items-center gap-2 text-left",
				className,
			)}
>>>>>>> 16bc1c863785d2e3350bd9c2baa4bc31be43087d
			{...props}
		/>
	)
}

export function AlertDialogDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
<<<<<<< HEAD
	return <p className={`text-[var(--vscode-descriptionForeground)] text-sm text-left ${className}`} {...props} />
=======
	return <p className={cn("text-[var(--vscode-descriptionForeground)] text-sm text-left", className)} {...props} />
>>>>>>> 16bc1c863785d2e3350bd9c2baa4bc31be43087d
}

export function AlertDialogAction({ className, ...props }: React.ComponentProps<typeof VSCodeButton>) {
	return <VSCodeButton appearance="primary" {...props} />
}

export function AlertDialogCancel({ className, ...props }: React.ComponentProps<typeof VSCodeButton>) {
	return <VSCodeButton appearance="secondary" {...props} />
}

export function UnsavedChangesDialog({
	open,
	onOpenChange,
	onConfirm,
	onCancel,
<<<<<<< HEAD
	onSave,
	title = "Unsaved Changes",
	description = "You have unsaved changes. Are you sure you want to discard them?",
	confirmText = "Discard Changes",
	saveText = "Save & Continue",
	showSaveOption = false,
=======
>>>>>>> 16bc1c863785d2e3350bd9c2baa4bc31be43087d
}: {
	open: boolean
	onOpenChange: (open: boolean) => void
	onConfirm: () => void
	onCancel: () => void
<<<<<<< HEAD
	onSave?: () => void
	title?: string
	description?: string
	confirmText?: string
	saveText?: string
	showSaveOption?: boolean
=======
>>>>>>> 16bc1c863785d2e3350bd9c2baa4bc31be43087d
}) {
	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>
						<AlertTriangle className="w-5 h-5 text-[var(--vscode-errorForeground)]" />
<<<<<<< HEAD
						{title}
					</AlertDialogTitle>
					<AlertDialogDescription>{description}</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
					{showSaveOption && onSave && <AlertDialogAction onClick={onSave}>{saveText}</AlertDialogAction>}
					<AlertDialogAction onClick={onConfirm} appearance={showSaveOption ? "secondary" : "primary"}>
						{confirmText}
					</AlertDialogAction>
=======
						Unsaved Changes
					</AlertDialogTitle>
					<AlertDialogDescription>
						You have unsaved changes. Are you sure you want to discard them?
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
					<AlertDialogAction onClick={onConfirm}>Discard Changes</AlertDialogAction>
>>>>>>> 16bc1c863785d2e3350bd9c2baa4bc31be43087d
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}
