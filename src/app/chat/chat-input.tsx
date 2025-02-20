"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import * as React from "react";
import { useEffect, useRef } from "react";

interface ChatInputProps {
  isLoading?: boolean;
  className?: string;
}

export function ChatInput({ isLoading, className }: ChatInputProps) {
  const [input, setInput] = React.useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight + 2}px`;
    }
  };

  const resetHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = "98px";
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      adjustHeight();
    }
  }, []);

  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value);
    adjustHeight();
  };

  const submitForm = () => {
    if (!input.trim()) return;
    setInput("");
    resetHeight();
    textareaRef.current?.focus();
  };

  return (
    <div className="relative flex w-full flex-col gap-4">
      <Textarea
        ref={textareaRef}
        placeholder="Send a message..."
        value={input}
        onChange={handleInput}
        className={cn(
          "max-h-[calc(75dvh)] min-h-[24px] resize-none overflow-hidden rounded-2xl bg-muted pb-10 !text-base",
          className,
        )}
        rows={2}
        autoFocus
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            if (isLoading) {
              return;
            }
            submitForm();
          }
        }}
      />

      <div className="absolute bottom-0 right-0 flex w-fit flex-row justify-end p-2">
        {isLoading ? (
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 hover:bg-accent/50"
            onClick={() => {}}
          >
            <Icons.stopCircle className="h-8 w-8" />
            <span className="sr-only">Stop generating</span>
          </Button>
        ) : (
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 hover:bg-accent/50"
            disabled={isLoading || !input.trim()}
            onClick={submitForm}
          >
            <Icons.circleArrowUp className="scale-150" />
            <span className="sr-only">Send message</span>
          </Button>
        )}
      </div>
    </div>
  );
}
