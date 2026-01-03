import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { uploadApi } from '../../services/api';
import FileUploadZone from './FileUploadZone';
import type { UrbanExpansionData, ClimateData, HistoricalYieldData } from '../../types';

export default function DataUpload() {
  const [uploadedFiles, setUploadedFiles] = useState<{
    urban?: UrbanExpansionData;
    temperature?: ClimateData;
    precipitation?: ClimateData;
    historicalYields?: HistoricalYieldData;
  }>({});

  const urbanUpload = useMutation({
    mutationFn: (file: File) => uploadApi.uploadUrban(file),
    onSuccess: (data) => {
      setUploadedFiles((prev) => ({ ...prev, urban: data }));
    },
  });

  const temperatureUpload = useMutation({
    mutationFn: (file: File) => uploadApi.uploadClimate(file, 'temperature'),
    onSuccess: (data) => {
      setUploadedFiles((prev) => ({ ...prev, temperature: data }));
    },
  });

  const precipitationUpload = useMutation({
    mutationFn: (file: File) => uploadApi.uploadClimate(file, 'precipitation'),
    onSuccess: (data) => {
      setUploadedFiles((prev) => ({ ...prev, precipitation: data }));
    },
  });

  const historicalYieldsUpload = useMutation({
    mutationFn: (file: File) => uploadApi.uploadHistoricalYields(file),
    onSuccess: (data) => {
      setUploadedFiles((prev) => ({ ...prev, historicalYields: data }));
    },
  });

  return (
    <div>
      {/* Topbar */}
      <header className="topbar flex items-center justify-between gap-3 p-4 rounded-[26px] mb-[18px]"
              style={{
                background: 'linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.035))',
                border: '1px solid rgba(255,255,255,.10)',
                boxShadow: '0 18px 60px rgba(0,0,0,.55)'
              }}>
        <div className="crumbs flex items-center gap-[10px] flex-wrap">
          <span className="tag font-mono text-[12px] px-[7px_10px] rounded-full"
                style={{
                  border: '1px solid rgba(255,255,255,.12)',
                  background: 'rgba(0,0,0,.18)',
                  color: 'rgba(255,255,255,.66)'
                }}>Upload Data</span>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Urban Expansion Upload */}
        <div className="card rounded-[26px] overflow-hidden"
             style={{
               background: 'linear-gradient(180deg, rgba(255,255,255,.065), rgba(255,255,255,.03))',
               border: '1px solid rgba(255,255,255,.10)',
               boxShadow: '0 18px 60px rgba(0,0,0,.55)'
             }}>
          <div className="hd p-4 pb-3 border-b border-white/8"
               style={{ background: 'rgba(0,0,0,.12)' }}>
            <h2 className="m-0 text-[14px] tracking-[.02em]">Urban Expansion Map</h2>
            <p className="m-[6px_0_0] text-[12px]" style={{ color: 'rgba(255,255,255,.66)', lineHeight: 1.35 }}>
              Upload TIFF files containing urban expansion data
            </p>
          </div>
          <div className="bd p-4">
            <FileUploadZone
              accept=".tif,.tiff"
              onUpload={(file) => urbanUpload.mutate(file)}
              isLoading={urbanUpload.isPending}
              error={urbanUpload.error?.message}
              uploadedFile={uploadedFiles.urban?.filename}
            />
          </div>
        </div>

        {/* Temperature Upload */}
        <div className="card rounded-[26px] overflow-hidden"
             style={{
               background: 'linear-gradient(180deg, rgba(255,255,255,.065), rgba(255,255,255,.03))',
               border: '1px solid rgba(255,255,255,.10)',
               boxShadow: '0 18px 60px rgba(0,0,0,.55)'
             }}>
          <div className="hd p-4 pb-3 border-b border-white/8"
               style={{ background: 'rgba(0,0,0,.12)' }}>
            <h2 className="m-0 text-[14px] tracking-[.02em]">Temperature Data</h2>
            <p className="m-[6px_0_0] text-[12px]" style={{ color: 'rgba(255,255,255,.66)', lineHeight: 1.35 }}>
              Upload NetCDF files containing temperature anomaly data
            </p>
          </div>
          <div className="bd p-4">
            <FileUploadZone
              accept=".nc,.netcdf"
              onUpload={(file) => temperatureUpload.mutate(file)}
              isLoading={temperatureUpload.isPending}
              error={temperatureUpload.error?.message}
              uploadedFile={uploadedFiles.temperature?.filename}
            />
          </div>
        </div>

        {/* Precipitation Upload */}
        <div className="card rounded-[26px] overflow-hidden"
             style={{
               background: 'linear-gradient(180deg, rgba(255,255,255,.065), rgba(255,255,255,.03))',
               border: '1px solid rgba(255,255,255,.10)',
               boxShadow: '0 18px 60px rgba(0,0,0,.55)'
             }}>
          <div className="hd p-4 pb-3 border-b border-white/8"
               style={{ background: 'rgba(0,0,0,.12)' }}>
            <h2 className="m-0 text-[14px] tracking-[.02em]">Precipitation Data</h2>
            <p className="m-[6px_0_0] text-[12px]" style={{ color: 'rgba(255,255,255,.66)', lineHeight: 1.35 }}>
              Upload NetCDF files containing precipitation anomaly data
            </p>
          </div>
          <div className="bd p-4">
            <FileUploadZone
              accept=".nc,.netcdf"
              onUpload={(file) => precipitationUpload.mutate(file)}
              isLoading={precipitationUpload.isPending}
              error={precipitationUpload.error?.message}
              uploadedFile={uploadedFiles.precipitation?.filename}
            />
          </div>
        </div>

        {/* Historical Yields Upload */}
        <div className="card rounded-[26px] overflow-hidden"
             style={{
               background: 'linear-gradient(180deg, rgba(255,255,255,.065), rgba(255,255,255,.03))',
               border: '1px solid rgba(255,255,255,.10)',
               boxShadow: '0 18px 60px rgba(0,0,0,.55)'
             }}>
          <div className="hd p-4 pb-3 border-b border-white/8"
               style={{ background: 'rgba(0,0,0,.12)' }}>
            <h2 className="m-0 text-[14px] tracking-[.02em]">Historical Crop Yields (Optional)</h2>
            <p className="m-[6px_0_0] text-[12px]" style={{ color: 'rgba(255,255,255,.66)', lineHeight: 1.35 }}>
              Upload NetCDF files containing historical wheat yield data
            </p>
          </div>
          <div className="bd p-4">
            <FileUploadZone
              accept=".nc,.netcdf"
              onUpload={(file) => historicalYieldsUpload.mutate(file)}
              isLoading={historicalYieldsUpload.isPending}
              error={historicalYieldsUpload.error?.message}
              uploadedFile={uploadedFiles.historicalYields?.filename}
            />
          </div>
        </div>
      </div>

      {/* Upload Summary */}
      {Object.keys(uploadedFiles).length > 0 && (
        <div className="mt-6 p-4 rounded-2xl border"
             style={{
               border: '1px solid rgba(119,242,193,.30)',
               background: 'rgba(119,242,193,.08)'
             }}>
          <h3 className="text-sm font-semibold mb-2">Uploaded Files</h3>
          <ul className="space-y-1 text-sm" style={{ color: 'rgba(255,255,255,.88)' }}>
            {uploadedFiles.urban && <li>✓ Urban Expansion: {uploadedFiles.urban.filename}</li>}
            {uploadedFiles.temperature && <li>✓ Temperature: {uploadedFiles.temperature.filename}</li>}
            {uploadedFiles.precipitation && <li>✓ Precipitation: {uploadedFiles.precipitation.filename}</li>}
            {uploadedFiles.historicalYields && <li>✓ Historical Yields: {uploadedFiles.historicalYields.filename}</li>}
          </ul>
        </div>
      )}
    </div>
  );
}
