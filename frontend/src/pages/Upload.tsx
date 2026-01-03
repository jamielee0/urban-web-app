import DataUpload from '../components/Upload/DataUpload';

export default function Upload() {
  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Upload Data</h1>
        <p className="mt-2 text-sm text-gray-600">
          Upload urban expansion maps, climate data, and historical crop yields
        </p>
      </div>

      <DataUpload />
    </div>
  );
}

