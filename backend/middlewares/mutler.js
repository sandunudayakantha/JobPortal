import multer from "multer";
import { fileTypeFromBuffer } from 'file-type';

const memoryStorage = multer.memoryStorage();

// Image uploads (profile photos, company logos)
export const imageUpload = multer({
	storage: memoryStorage,
	limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
	fileFilter: (req, file, cb) => {
		// Basic MIME allowlist - final verification is done by inspecting file buffer
		const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
		if (allowed.includes(file.mimetype)) return cb(null, true);
		return cb(new Error('Invalid file type. Only images are allowed.'));
	}
});

// Document uploads (resumes)
export const documentUpload = multer({
	storage: memoryStorage,
	limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
	fileFilter: (req, file, cb) => {
		const allowed = [
			'application/pdf',
			'application/msword',
			'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
		];
		if (allowed.includes(file.mimetype)) return cb(null, true);
		return cb(new Error('Invalid file type. Only PDF or Word documents are allowed.'));
	}
});

// Utility: detect file type from buffer (magic bytes)
export const detectFileType = async (buffer) => {
	if (!buffer || buffer.length === 0) return 'unknown';
	try {
		const ft = await fileTypeFromBuffer(buffer);
		if (!ft || !ft.ext) return 'unknown';

		// Normalize extensions to our expected tokens
		const ext = ft.ext.toLowerCase();
		if (ext === 'jpg' || ext === 'jpeg') return 'jpeg';
		if (ext === 'png') return 'png';
		if (ext === 'gif') return 'gif';
		if (ext === 'webp') return 'webp';
		if (ext === 'pdf') return 'pdf';
		if (ext === 'doc') return 'doc';
		if (ext === 'docx') return 'docx';

		return 'unknown';
	} catch (e) {
		return 'unknown';
	}
};

// Export legacy singleUpload as a generic (discouraged) fallback
export const singleUpload = multer({ storage: memoryStorage }).single('file');