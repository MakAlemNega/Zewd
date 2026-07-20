import Invitation from "@/models/Invitation";

// Returns the invitation only if `user` is its owner — used to keep one
// user's guest list and drafts invisible to everyone else.
export async function findOwnedInvitation(user, invitationId) {
  if (!user) return null;

  const invitation = await Invitation.findById(invitationId);
  if (!invitation || !invitation.owner) return null;
  if (invitation.owner.toString() !== user._id.toString()) return null;

  return invitation;
}
