const { PartnerRequest, User, Category } = require('../models');

exports.apply = async (req, res) => {
  const { fullName, email, phone, categoryId, city, description} = req.body;

  try {
    const existing = await PartnerRequest.findOne({ where: { email, status: 'pending' } });
    if (existing) return res.status(400).json({ message: 'You already have a pending request' });

    const request = await PartnerRequest.create({
      fullName, email, phone, categoryId, city, description
    });

    res.status(201).json({ message: 'Partner request submitted', request });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getPending = async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Unauthorized' });

  const requests = await PartnerRequest.findAll({
    where: { status: 'pending' },
    include: ['category']
  });

  res.json(requests);
};

exports.reviewRequest = async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Unauthorized' });

  const { id } = req.params;
  const { status } = req.body;

  try {
    const request = await PartnerRequest.findByPk(id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    request.status = status;
    await request.save();

    if (status === 'approved') {
      await User.create({
        name: request.fullName,
        email: request.email,
        phone: request.phone,
        role: 'helper',
        passwordHash: 'default123' 
      });
    }

    res.json({ message: `Request ${status}`, request });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
