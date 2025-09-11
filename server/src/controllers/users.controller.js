exports.updateProfile = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ error: "Unauthorized" });

    const {
      displayname,
      description,
      username,
      email,
      role,
      createdAt,
      deletedAt,
      id,
    } = req.body;

    const forbidden = {
      role,
      createdAt,
      deletedAt,
      id,
    };
    for (const k of Object.keys(forbidden)) {
      if (forbidden[k] !== undefined) {
        return res
          .status(400)
          .json({ error: `Field '${k}' cannot be changed` });
      }
    }

    if (displayname !== undefined)
      user.displayname = String(displayname).trim();
    if (description !== undefined) user.description = String(description);
    if (displayname !== undefined)
      user.displayname = String(displayname).trim();
    if (description !== undefined) user.description = String(description);
    if (username !== undefined) user.username = String(username).trim();
    if (email !== undefined) user.email = String(email).trim();

    await user.save();

    const data = user.toJSON ? user.toJSON() : user;
    delete data.password;

    res.json({ success: true, message: "Profile updated", data });
  } catch (err) {
    next(err);
  }
};

exports.deleteProfile = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ error: "Unauthorized" });

    const SOFT_DELETE = true; // soft delete, delete this line or set to false for hard delete

    if (SOFT_DELETE) {
      // require column deletedAt
      user.deletedAt = new Date();
      await user.save();
    } else {
      await user.destroy();
    }

    res.clearCookie("refreshToken");
    res.json({ success: true, message: "Profile deleted", data: null });
  } catch (err) {
    next(err);
  }
};
