"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import * as React from "react";
import { useEffect, useRef } from "react";

interface ChatInputProps {
  className?: string;
  input: string;
  disabled?: boolean;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: () => void;
  onStop?: () => void;
}

export function ChatInput({
  className,
  input,
  disabled,
  handleInputChange,
  handleSubmit,
  onStop,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isComposing = useRef(false);

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
    handleInputChange(event);
    adjustHeight();
  };

  const submitForm = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || disabled) return;
    handleSubmit();
    resetHeight();
    textareaRef.current?.focus();
  };

  return (
    <form onSubmit={submitForm} className="relative flex w-full flex-col gap-4">
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
        disabled={disabled}
        onCompositionStart={() => {
          isComposing.current = true;
        }}
        onCompositionEnd={() => {
          isComposing.current = false;
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            if (isComposing.current || disabled) {
              return;
            }
            event.preventDefault();
            submitForm();
          }
        }}
      />

      <div className="absolute bottom-0 right-0 flex w-fit flex-row justify-end p-2">
        {onStop ? (
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="h-8 w-8 hover:bg-accent/50"
            onClick={onStop}
          >
            <Icons.stopCircle className="scale-150" />
            <span className="sr-only">Stop generating</span>
          </Button>
        ) : (
          <Button
            type="submit"
            size="icon"
            variant="ghost"
            className="h-8 w-8 hover:bg-accent/50"
            disabled={disabled || !input.trim()}
          >
            <Icons.circleArrowUp className="scale-150" />
            <span className="sr-only">Send message</span>
          </Button>
        )}
      </div>
    </form>
  );
}
