import multer from "multer";

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
export const detectFileType = (buffer) => {
	if (!buffer || buffer.length < 4) return 'unknown';
	const sig = buffer.slice(0, 8).toString('hex').toLowerCase();

	// JPEG: ff d8 ff
	if (sig.startsWith('ffd8ff')) return 'jpeg';
	// PNG: 89 50 4e 47 0d 0a 1a 0a
	if (sig.startsWith('89504e47')) return 'png';
	// GIF: 47 49 46 38
	if (sig.startsWith('47494638')) return 'gif';
	// WEBP: RIFF....WEBP -> 52 49 46 46 ???? 57 45 42 50
	if (buffer.slice(0,4).toString() === 'RIFF' && buffer.slice(8,12).toString() === 'WEBP') return 'webp';
	// PDF: %PDF
	if (buffer.slice(0,4).toString() === '%PDF') return 'pdf';
	// DOC (CFB): d0 cf 11 e0 a1 b1 1a e1
	if (sig.startsWith('d0cf11e0a1b11ae1')) return 'doc';
	// DOCX / OOXML: ZIP file signature 50 4b 03 04
	if (sig.startsWith('504b0304')) return 'docx';

	return 'unknown';
};

// Export legacy singleUpload as a generic (discouraged) fallback
export const singleUpload = multer({ storage: memoryStorage }).single('file');