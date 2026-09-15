"use client";
import React, { useRef, useState, useCallback } from "react";
import { GripVertical, X, Upload, Loader2 } from "lucide-react";
import Image from "next/image";

export type GalleryItem = {
  id: string;
  file?: File;
  url?: string;
  preview?: string;
};

interface ImageGalleryProps {
  items: GalleryItem[];
  onReorder: (newItems: GalleryItem[]) => void;
  onUpload: (files: FileList) => void;
  onRemove: (index: number) => void;
  maxItems?: number;
  isUploading?: boolean;
}

export default function ImageGallery({
  items,
  onReorder,
  onUpload,
  onRemove,
  maxItems = 10,
  isUploading = false,
}: ImageGalleryProps) {
  const dragIndexRef = useRef<number | null>(null);
  const dragOverIndexRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const cleanup = useCallback(() => {
    dragIndexRef.current = null;
    dragOverIndexRef.current = null;
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    setDragIdx(null);
    setDragOverIdx(null);
  }, []);

  const handleDragStart = useCallback(
    (e: React.DragEvent<HTMLDivElement>, index: number) => {
      dragIndexRef.current = index;
      setDragIdx(index);
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", index.toString());
    },
    [],
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>, index: number) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";

      if (dragOverIndexRef.current === index) return;
      dragOverIndexRef.current = index;

      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        setDragOverIdx(index);
      });
    },
    [],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>, index: number) => {
      e.preventDefault();
      const fromIndex = dragIndexRef.current;
      if (fromIndex === null || fromIndex === index) {
        cleanup();
        return;
      }

      const newItems = [...items];
      const [dragged] = newItems.splice(fromIndex, 1);
      newItems.splice(index, 0, dragged);
      onReorder(newItems);
      cleanup();
    },
    [items, onReorder, cleanup],
  );

  const handleDragEnd = useCallback(() => {
    cleanup();
  }, [cleanup]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    onUpload(files);
    e.target.value = "";
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <input
        ref={fileInputRef}
        type="file"
        id="image-upload"
        multiple
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        disabled={isUploading}
      />
      {items.map((item, idx) => (
        <div
          key={item.id}
          draggable
          onDragStart={(e) => handleDragStart(e, idx)}
          onDragOver={(e) => handleDragOver(e, idx)}
          onDrop={(e) => handleDrop(e, idx)}
          onDragEnd={handleDragEnd}
          className={`relative aspect-square rounded overflow-hidden border group transition-all ${
            dragOverIdx === idx && dragIdx !== idx
              ? "border-gold border-2 scale-[1.03]"
              : "border-gray-100"
          } ${dragIdx === idx ? "opacity-40" : ""}`}
        >
          <Image
            src={item.file ? item.preview || "" : item.url || ""}
            alt={`Product ${idx}`}
            fill
            className="object-cover"
            unoptimized
          />
          {/* Drag handle */}
          <div className="absolute top-1 left-1 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing z-10">
            <GripVertical size={12} />
          </div>
          {/* Remove button */}
          <button
            type="button"
            onClick={() => onRemove(idx)}
            className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
          >
            <X size={12} />
          </button>
          {/* Primary badge */}
          {idx === 0 && (
            <span className="absolute bottom-0 left-0 right-0 bg-gold text-black text-[8px] font-black uppercase py-1 text-center">
              Primary — Drag to reorder
            </span>
          )}
        </div>
      ))}
      {items.length < maxItems && (
        <label
          htmlFor="image-upload"
          className="aspect-square border-2 border-dashed border-gray-200 bg-gray-50 rounded flex flex-col items-center justify-center text-gray-400 hover:border-black hover:bg-gray-100 hover:text-black transition-all cursor-pointer group"
        >
          {isUploading ? (
            <Loader2 size={24} className="animate-spin text-gold" />
          ) : (
            <>
              <Upload
                size={24}
                className="mb-2 group-hover:-translate-y-1 transition-transform"
              />
              <span className="text-[10px] font-bold text-center px-2">
                {items.length === 0 ? "Main Image" : "Add Image"}
              </span>
            </>
          )}
        </label>
      )}
    </div>
  );
}
