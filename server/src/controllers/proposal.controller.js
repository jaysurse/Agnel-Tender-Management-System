export async function listProposals(req, res, next) {
  try {
    res.json({ proposals: [] });
  } catch (err) {
    next(err);
  }
}
