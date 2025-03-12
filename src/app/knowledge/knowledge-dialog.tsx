import Editor from "@/components/editor";
import { FormButton } from "@/components/form-button";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Note, NoteType } from "@/lib/db";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string(),
  type: z.nativeEnum(NoteType),
});

type FormData = z.infer<typeof formSchema>;

interface KnowledgeDialogProps {
  onSubmit: (
    data: Omit<Note, "id" | "createdAt" | "updatedAt" | "embeddingUpdatedAt">,
  ) => Promise<void>;
  trigger?: React.ReactNode;
  className?: string;
}

export function KnowledgeDialog({
  onSubmit,
  trigger,
  className,
}: KnowledgeDialogProps) {
  const [open, setOpen] = useState(false);
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      type: NoteType.Knowledge,
    },
  });

  const handleSubmit = async (data: FormData) => {
    await onSubmit(data);
    setOpen(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            variant="outline"
            className={cn(
              "gap-2 px-4 py-2 text-sm font-medium transition-all hover:bg-muted",
              className,
            )}
          >
            <Plus className="h-4 w-4" />
            <span>New Entry</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl gap-4 p-6">
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-xl font-semibold">
            New Knowledge Entry
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Create a new entry in your knowledge base. Use markdown for rich
            text formatting.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="mt-4 space-y-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter a descriptive title..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Editor
                      markdown={field.value}
                      onValueChange={field.onChange}
                      className="min-h-[400px] rounded-md border px-3 py-1"
                      contentEditableClassName="min-h-[400px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormButton type="submit" className="w-full">
              Create Entry
            </FormButton>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
