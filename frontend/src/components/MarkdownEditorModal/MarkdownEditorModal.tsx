import { useState, useRef } from "react";
import { FaLink } from "react-icons/fa6";
import { Modal } from "@/components/Modal";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm"

import styles from "./MarkdownEditorModal.module.scss";

export default function MarkdownEditorModal({
  visibility,
  value = "",
  onSave,
  onUnboundClick,
  onVisible
}: {
  visibility: boolean;
  value?: string;
  onSave?: (e: React.MouseEvent<HTMLButtonElement>, editorText: string) => void;
  onUnboundClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onVisible?: () => void;
}) {
  const lastClickRef = useRef<number>(0);
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const [editorText, setEditorText] = useState(value);

  return (
    <Modal visibility={visibility} onUnboundClick={onUnboundClick} onVisible={onVisible}>
      <div
        className="scroll-auto-hide w-full h-full flex flex-col rounded-xl overflow-hidden p-3 py-4 items-center"
        onClick={() => {
          const now = Date.now();
          if (now - lastClickRef.current <= 200) {
            lastClickRef.current = 0;
            const sel = window.getSelection?.();
            sel?.removeAllRanges();
            setIsEditable((prev) => !prev);
          } else {
            lastClickRef.current = now;
          }
        }}
      >
        {isEditable ? (
          <textarea
            className="w-full h-full outline-0 font-mono"
            value={editorText}
            onChange={(e) => setEditorText(e.target.value)}
          />
        ) : (
          <div
            className={`${styles.markdown} scroll-auto-hide flex-1 w-full h-full font-roboto overflow-auto px-3 pl-0 break-words`}
          >
            <Markdown
              remarkPlugins={[remarkGfm]}
              components={{
                a: ({ node, ...props }) => (
                  <a
                    {...props}
                    className="inline-flex gap-2 items-center rounded-full bg-accent px-2 text-text-primary hover:bg-accent/80 transition"
                  >
                    <FaLink className="md-icon" aria-hidden />
                    {props.children}
                  </a>
                ),
              }}
            >
              {editorText}
            </Markdown>
          </div>
        )}
        <button
          onClick={(e) => onSave && onSave(e, editorText)}
          className={
            "bg-bg w-[80%] h-15 text-text-inverse rounded-sm shadow-lg hover:bg-accent hover:text-text-primary hover:border-accent hover:brightness-120 border-border border-2 transition " +
            (isEditable ? "hidden" : "visible")
          }
        >
          Save
        </button>
      </div>
    </Modal>
  );
}
