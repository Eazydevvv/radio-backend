import News from '../models/News.js';
import { validationResult } from 'express-validator';
import { buildPagination, makeFileUrl } from './utils.js';

export const listNews = async (req, res, next) => {
    try {
        const { page, limit, skip } = buildPagination(req);
        const { q, category } = req.query;
        const filter = {};
        if (q) filter.$text = { $search: q };
        if (category) filter.category = category;

        const [items, total] = await Promise.all([
            News.find(filter).sort({ datetime: -1 }).skip(skip).limit(limit),
            News.countDocuments(filter)
        ]);

        res.json({ page, limit, total, items });
    } catch (err) { next(err); }
};

// CHANGED: Use findById instead of findOne with slug
export const getNews = async (req, res, next) => {
    try {
        const item = await News.findById(req.params.id); // CHANGED: Use findById with ID
        if (!item) return res.status(404).json({ message: 'News article not found' });
        res.json(item);
    } catch (err) { next(err); }
};

export const createNews = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        let imageUrl = null;
        let imageFilename = null;
        
        // Handle image upload
        if (req.file) {
            imageFilename = req.file.filename;
            imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        }

        const item = await News.create({
            title: req.body.title,
            summary: req.body.summary,
            content: req.body.content,
            datetime: req.body.datetime ? new Date(req.body.datetime) : new Date(),
            category: req.body.category,
            author: req.body.author,
            image: imageFilename, // Store filename
            imageUrl: imageUrl    // Store full URL
        });

        res.status(201).json(item);
    } catch (err) { 
        console.error('Create news error:', err);
        next(err); 
    }
};

// CHANGED: Use findByIdAndUpdate instead of findOne with slug
export const updateNews = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        let imageUrl = null;
        let imageFilename = null;
        
        // Handle image upload
        if (req.file) {
            imageFilename = req.file.filename;
            imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        }

        // Prepare update data
        const updateData = {
            title: req.body.title,
            summary: req.body.summary,
            content: req.body.content,
            category: req.body.category,
            author: req.body.author
        };

        // Add datetime if provided
        if (req.body.datetime) {
            updateData.datetime = new Date(req.body.datetime);
        }

        // Add image fields if new image was uploaded
        if (req.file) {
            updateData.image = imageFilename;
            updateData.imageUrl = imageUrl;
        }

        // CHANGED: Use findByIdAndUpdate with ID
        const item = await News.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!item) return res.status(404).json({ message: 'News article not found' });
        res.json(item);
    } catch (err) { next(err); }
};

// CHANGED: Use findByIdAndDelete instead of findOneAndDelete with slug
export const deleteNews = async (req, res, next) => {
    try {
        const item = await News.findByIdAndDelete(req.params.id); // CHANGED: Use findByIdAndDelete with ID
        if (!item) return res.status(404).json({ message: 'News article not found' });
        res.json({ message: 'News article deleted successfully' });
    } catch (err) { next(err); }
};

// Get all news
export const getAllNews = async (req, res) => {
    try {
        const news = await News.find().sort({ createdAt: -1 }); // newest first
        res.status(200).json(news);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};