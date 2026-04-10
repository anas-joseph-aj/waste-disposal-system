import { ApiSetting } from '../models/api/ApiSetting.js';

export async function getSystemSettingsHandler(req, res, next) {
  try {
    let settings = await ApiSetting.findOne({ key: 'system' }).lean();
    if (!settings) {
      settings = await ApiSetting.create({ key: 'system', pickupFee: 50 });
    }

    return res.json({ settings: { pickupFee: Number(settings.pickupFee || 50) } });
  } catch (error) {
    next(error);
  }
}

export async function updateSystemSettingsHandler(req, res, next) {
  try {
    const { pickupFee } = req.body || {};

    if (pickupFee === undefined || Number.isNaN(Number(pickupFee))) {
      return res.status(400).json({ message: 'pickupFee is required and must be a number.' });
    }

    const numericFee = Math.max(0, Number(pickupFee));
    const updated = await ApiSetting.findOneAndUpdate(
      { key: 'system' },
      { $set: { pickupFee: numericFee } },
      { upsert: true, new: true }
    );

    return res.json({ settings: { pickupFee: Number(updated.pickupFee || 50) } });
  } catch (error) {
    next(error);
  }
}
