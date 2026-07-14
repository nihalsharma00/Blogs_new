import { Request, Response } from 'express';
import { uploadToCloudinary, deleteFromCloudinary } from '../lib/cloudinary';
import prisma from '../lib/prisma';

export const uploadMedia = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: { code: 'BAD_REQUEST', message: 'No file provided' } });
    }

    const uploaderId = (req as any).user.id;
    const result = await uploadToCloudinary(req.file.buffer);

    const media = await prisma.mediaAsset.create({
      data: {
        url: result.secure_url,
        publicId: result.public_id,
        uploaderId,
        altText: req.body.altText || null,
        postId: req.body.postId || null,
      },
    });

    return res.status(201).json({ success: true, data: media });
  } catch (error) {
    console.error('Upload Error:', error);
    return res.status(500).json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to upload media' } });
  }
};

export const deleteMedia = async (req: Request, res: Response) => {
  try {
    const mediaId = req.params.id;
    const media = await prisma.mediaAsset.findUnique({ where: { id: mediaId } });
    
    if (!media) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Media not found' } });
    
    await deleteFromCloudinary(media.publicId);
    await prisma.mediaAsset.delete({ where: { id: mediaId } });

    return res.status(200).json({ success: true, data: null });
  } catch (error) {
    return res.status(500).json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to delete media' } });
  }
};
