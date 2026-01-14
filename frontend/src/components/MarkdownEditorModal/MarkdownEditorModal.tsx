import { useRef, useState } from "react";

import { FaLink } from "react-icons/fa6";
import { GoTrash } from "react-icons/go";
import { IoMdArrowBack } from "react-icons/io";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Modal } from "@/components/Modal";

import styles from "./MarkdownEditorModal.module.scss";

export default function MarkdownEditorModal({
  visibility,
  value = "",
  showDelete = true,
  showBack = true,
  onSave,
  onDelete,
  onBack,
  onUnboundClick,
  onVisible,
}: {
  visibility: boolean;
  value?: string;
  showDelete?: boolean;
  showBack?: boolean;
  onSave?: (e: React.MouseEvent<HTMLButtonElement>, editorText: string) => void;
  onDelete?: (
    e: React.MouseEvent<HTMLButtonElement>,
    editorText: string,
  ) => void;
  onBack?: (e: React.MouseEvent<HTMLButtonElement>, editorText: string) => void;
  onUnboundClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onVisible?: () => void;
}) {
  const lastClickRef = useRef<number>(0);
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const [editorText, setEditorText] = useState(value);

  return (
    <Modal
      visibility={visibility}
      onUnboundClick={onUnboundClick}
      onVisible={onVisible}
    >
      <div
        className="scroll-auto-hide w-full h-full flex flex-col rounded-xl overflow-hidden p-3 pt-0 items-center"
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
            className="w-full h-full outline-0 font-mono pt-3"
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
        <div
          className={
            "flex w-full gap-3 justify-center"
          }
        >
          <button
            onClick={(e) => onSave && onSave(e, editorText)}
            className={
              "bg-bg flex-1 h-15 text-text-inverse rounded-sm shadow-lg hover:bg-accent hover:text-text-primary hover:border-accent hover:brightness-120 active:bg-accent active:text-text-primary active:border-accent active:brightness-120 border-border border-2 transition " +
              (isEditable ? "hidden" : "visible")
            }
          >
            Save
          </button>
          {showDelete && (
            <button
              onClick={(e) => onDelete && onDelete(e, editorText)}
              className={
                "bg-bg w-[20%] lg:w-[10%] h-15 text-text-inverse rounded-sm shadow-lg hover:bg-red-400 hover:text-text-primary hover:border-red-400 hover:brightness-120 active:bg-red-400 active:text-text-primary active:border-red-400 active:brightness-120 border-border border-2 transition flex justify-center items-center " +
                (isEditable ? "hidden" : "visible")
              }
            >
              <GoTrash size={30} />
            </button>
          )}
          {showBack && (
            <button
              onClick={(e) => onBack && onBack(e, editorText)}
              className={
                "bg-bg w-[20%] lg:w-[10%] h-15 text-text-inverse rounded-sm shadow-lg hover:bg-orange-400/80 hover:text-text-primary hover:border-orange-400/80 hover:brightness-120 active:bg-orange-400/80 active:text-text-primary active:border-orange-400/80 active:brightness-120 border-border border-2 transition flex justify-center items-center " +
                (isEditable ? "hidden" : "visible")
              }
            >
              <IoMdArrowBack size={30} />
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
}
