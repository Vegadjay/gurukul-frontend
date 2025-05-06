import React, { useState, useEffect } from "react";
import {
    FileText,
    Upload,
    X,
    Check,
    ArrowLeft,
    File
} from "lucide-react";

const UploadContent = () => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileError, setFileError] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [uploadError, setUploadError] = useState("");
    const [guruId, setGuruId] = useState(null);

    useEffect(() => {
        const guru = JSON.parse(localStorage.getItem('user'));
        if (guru && guru._id) {
            setGuruId(guru._id);
        }
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.type !== "application/pdf") {
                setFileError("Only PDF files are allowed");
                setSelectedFile(null);
                return;
            }

            if (file.size > 10 * 1024 * 1024) {
                setFileError("File size should be less than 10MB");
                setSelectedFile(null);
                return;
            }

            setFileError("");
            setSelectedFile(file);
        }
    };

    const removeFile = () => {
        setSelectedFile(null);
        setFileError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploadError("");

        if (!formData.title.trim()) {
            setUploadError("Please enter a title");
            return;
        }

        if (!formData.description.trim()) {
            setUploadError("Please enter a description");
            return;
        }

        if (!selectedFile) {
            setUploadError("Please select a PDF file");
            return;
        }

        if (!guruId) {
            setUploadError("User session not found. Please log in again.");
            return;
        }

        setIsUploading(true);

        try {
            const uploadData = new FormData();
            uploadData.append('title', formData.title);
            uploadData.append('description', formData.description);
            uploadData.append('guru', guruId);
            uploadData.append('contentFile', selectedFile);

            const response = await fetch(
                'https://gurukul-backend-21h3.onrender.com/api/content',
                {
                    method: 'POST',
                    body: uploadData,
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to upload content");
            }

            const data = await response.json();
            setIsUploading(false);
            setUploadSuccess(true);

            setTimeout(() => {
                setFormData({ title: "", description: "" });
                setSelectedFile(null);
                setUploadSuccess(false);
            }, 3000);
        } catch (error) {
            setIsUploading(false);
            console.error('Error uploading content:', error);
            setUploadError(error.message || "Failed to upload content. Please try again.");
        }
    };

    const goBack = () => {
        window.history.back();
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-poppins">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-10">
                <div className="mb-6">
                    <button
                        onClick={goBack}
                        className="text-2xl flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-poppins mb-4"
                    >
                        <ArrowLeft className="h-5 w-5 mr-1" />
                        Back to Dashboard
                    </button>
                    <h1 className="text-md font-bold text-gray-900 dark:text-white font-poppins">
                        Upload Content
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 font-poppins mt-1">
                        Share your knowledge by uploading educational content
                    </p>
                </div>

                {uploadSuccess ? (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900">
                            <Check className="h-6 w-6 text-green-600 dark:text-green-300" />
                        </div>
                        <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white font-poppins">
                            Upload Successful!
                        </h3>
                        <p className="mt-2 text-gray-600 dark:text-gray-400 font-poppins">
                            Your content has been uploaded successfully and is now available in your courses.
                        </p>
                    </div>
                ) : (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                        <div className="p-6">
                            <form onSubmit={handleSubmit}>
                                {uploadError && (
                                    <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded border border-red-200 dark:border-red-800">
                                        {uploadError}
                                    </div>
                                )}

                                <div className="mb-6">
                                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 font-poppins mb-1">
                                        Title
                                    </label>
                                    <input
                                        type="text"
                                        id="title"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        className="block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white font-poppins"
                                        placeholder="Enter content title"
                                    />
                                </div>

                                <div className="mb-6">
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 font-poppins mb-1">
                                        Description
                                    </label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        rows={4}
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        className="block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white font-poppins"
                                        placeholder="Enter content description"
                                    ></textarea>
                                </div>

                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 font-poppins mb-1">
                                        Upload PDF File
                                    </label>

                                    {!selectedFile ? (
                                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
                                            <div className="space-y-1 text-center">
                                                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                                                <div className="flex text-sm text-gray-600 dark:text-gray-400">
                                                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 focus-within:outline-none">
                                                        <span className="font-poppins">Upload a file</span>
                                                        <input
                                                            id="file-upload"
                                                            name="file-upload"
                                                            type="file"
                                                            accept=".pdf"
                                                            className="sr-only"
                                                            onChange={handleFileChange}
                                                        />
                                                    </label>
                                                    <p className="pl-1 font-poppins">or drag and drop</p>
                                                </div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 font-poppins">
                                                    PDF up to 10MB
                                                </p>
                                                {fileError && (
                                                    <p className="text-xs text-red-500 font-poppins">
                                                        {fileError}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="mt-1 flex items-center p-4 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700">
                                            <File className="h-8 w-8 text-blue-500 mr-3" />
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-gray-900 dark:text-white font-poppins">
                                                    {selectedFile.name}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 font-poppins">
                                                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                                </p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={removeFile}
                                                className="ml-2 flex-shrink-0 bg-white dark:bg-gray-800 p-1 rounded-full text-gray-400 hover:text-red-500"
                                            >
                                                <X className="h-5 w-5" />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center justify-end">
                                    <button
                                        type="button"
                                        onClick={goBack}
                                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 font-poppins mr-3"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isUploading}
                                        className={`flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 font-poppins ${isUploading ? "opacity-70 cursor-not-allowed" : ""
                                            }`}
                                    >
                                        {isUploading ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                Uploading...
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="h-4 w-4 mr-2" />
                                                Upload Content
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default UploadContent;