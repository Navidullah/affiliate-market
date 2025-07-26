"use client";

import { useState } from "react";
import imageCompression from "browser-image-compression";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function ImageCompressor() {
  const [originalImage, setOriginalImage] = useState(null);
  const [compressedImage, setCompressedImage] = useState(null);
  const [quality, setQuality] = useState(70);
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [format, setFormat] = useState("jpeg");

  const handleImageChange = (file) => {
    setOriginalImage(file);
    setCompressedImage(null);
  };

  const convertBlobToFile = async (blob, fileName) => {
    const arrayBuffer = await blob.arrayBuffer();
    return new File([arrayBuffer], fileName, { type: blob.type });
  };

  const compressImage = async () => {
    if (!originalImage) return;

    setLoading(true);
    const options = {
      maxSizeMB: 2,
      maxWidthOrHeight: 1024,
      initialQuality: quality / 100,
      fileType: `image/${format}`,
      useWebWorker: true,
    };

    try {
      const compressedBlob = await imageCompression(originalImage, options);
      const convertedFile = await convertBlobToFile(
        compressedBlob,
        `compressed.${format}`
      );
      setCompressedImage(convertedFile);
    } catch (err) {
      console.error("Compression failed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      handleImageChange(file);
    }
  };

  const sizeChartData =
    compressedImage && originalImage
      ? [
          {
            name: "Original",
            size: Number((originalImage.size / 1024 / 1024).toFixed(2)),
          },
          {
            name: "Compressed",
            size: Number((compressedImage.size / 1024 / 1024).toFixed(2)),
          },
        ]
      : [];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">📷 Image Compressor</h1>

      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragging ? "bg-blue-100 border-blue-500" : "bg-muted"
        }`}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onDragEnter={() => setDragging(true)}
        onDragLeave={() => setDragging(false)}
      >
        <p className="text-lg">
          Drag & drop an image here, or click to select a file
        </p>
        <Input
          type="file"
          accept="image/*"
          className="mt-4"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleImageChange(file);
          }}
        />
      </div>

      <div className="mt-6">
        <Label>Compression Quality: {quality}%</Label>
        <Slider
          min={10}
          max={100}
          step={5}
          defaultValue={[quality]}
          onValueChange={(value) => setQuality(value[0])}
          className="mt-2"
        />
      </div>

      <div className="mt-6">
        <Label>Select Output Format</Label>
        <Select defaultValue="jpeg" onValueChange={(value) => setFormat(value)}>
          <SelectTrigger className="mt-2" />
          <SelectContent>
            <SelectItem value="jpeg">JPEG</SelectItem>
            <SelectItem value="png">PNG</SelectItem>
            <SelectItem value="webp">WebP</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button onClick={compressImage} className="mt-6" disabled={loading}>
        {loading ? "Compressing..." : "Compress"}
      </Button>

      {compressedImage && (
        <div className="mt-10 space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold">Original</h3>
              <p>Size: {(originalImage?.size / 1024 / 1024).toFixed(2)} MB</p>
              <img
                src={URL.createObjectURL(originalImage)}
                alt="Original"
                className="rounded mt-2"
              />
            </div>
            <div>
              <h3 className="font-bold">Compressed ({format.toUpperCase()})</h3>
              <p>Size: {(compressedImage.size / 1024 / 1024).toFixed(2)} MB</p>
              <img
                src={URL.createObjectURL(compressedImage)}
                alt="Compressed"
                className="rounded mt-2"
              />
              <a
                href={URL.createObjectURL(compressedImage)}
                download={`compressed.${format}`}
                className="inline-block mt-2 text-blue-600 underline"
              >
                Download Image
              </a>
            </div>
          </div>

          {sizeChartData.length === 2 && (
            <div className="w-full h-64">
              <h3 className="text-xl font-semibold mb-2">
                Compression Comparison
              </h3>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sizeChartData}>
                  <XAxis dataKey="name" />
                  <YAxis
                    label={{ value: "MB", angle: -90, position: "insideLeft" }}
                  />
                  <Tooltip />
                  <Bar dataKey="size" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
