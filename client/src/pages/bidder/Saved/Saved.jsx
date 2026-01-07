import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageHeader from "../../../components/shared/PageHeader";
import useAuth from "../../../hooks/useAuth";
import { tenderService } from "../../../services/tenderService";
import { proposalService } from "../../../services/proposalService";

function isOpen(deadline) {
  try {
    return new Date(deadline).getTime() > Date.now();
  } catch {
    return false;
  }
}

export default function Saved() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [tenders, setTenders] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionId, setActionId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setError(null);
        const [tenderRes, proposalRes] = await Promise.all([
          tenderService.listTenders(token, { status: "PUBLISHED" }),
          proposalService.listMine(token),
        ]);
        if (cancelled) return;
        setTenders(tenderRes?.tenders || []);
        setProposals(proposalRes?.proposals || []);
      } catch (err) {
        if (!cancelled) setError(err.message || "Failed to load saved tenders");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    if (token) {
      load();
    } else {
      setLoading(false);
    }

    return () => {
      cancelled = true;
    };
  }, [token]);

  const proposalByTender = useMemo(() => {
    const map = new Map();
    proposals.forEach((p) => map.set(p.tender_id, p));
    return map;
  }, [proposals]);

  const startProposal = async (tenderId) => {
    setActionId(tenderId);
    try {
      const proposal = await proposalService.createDraft(tenderId, token);
      setProposals((prev) => [proposal, ...prev]);
      navigate(`/bidder/proposals/${proposal.proposal_id}`);
    } catch (err) {
      if (err.status === 400 && err.message?.includes("exists")) {
        const existing = proposalByTender.get(tenderId);
        if (existing) {
          navigate(`/bidder/proposals/${existing.proposal_id}`);
          return;
        }
        setError("You already have a proposal for this tender.");
      } else {
        setError(err.message || "Failed to start proposal");
      }
    } finally {
      setActionId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <PageHeader
        title="Saved Tenders"
        description="Tenders you’ve shortlisted for review and proposal drafting."
      />

      {loading ? (
        <div className="bg-white border border-neutral-200 rounded-lg p-8 text-center text-sm text-neutral-700">
          Loading tenders...
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 text-sm">
          {error}
        </div>
      ) : tenders.length === 0 ? (
        <div className="bg-white border border-neutral-200 rounded-lg p-8 text-center">
          <p className="text-sm text-neutral-700">
            No published tenders available right now.
          </p>
          <p className="text-xs text-neutral-500 mt-1">
            Check back soon for new opportunities.
          </p>
          <div className="mt-4">
            <Link
              to="/bidder/dashboard"
              className="px-4 py-2 rounded-md border border-neutral-300 text-neutral-700 hover:bg-neutral-50 text-sm"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tenders.map((t) => {
            const open = isOpen(t.submission_deadline);
            const existing = proposalByTender.get(t.tender_id);
            return (
              <div
                key={t.tender_id}
                className="bg-white border border-neutral-200 rounded-lg p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-neutral-900">
                      {t.title}
                    </div>
                    <div className="text-xs text-neutral-600 mt-1">
                      Issuing Authority: {t.organization_name || "Authority"}
                    </div>
                    <div className="text-xs text-neutral-600">
                      Submission Deadline: {t.submission_deadline ? new Date(t.submission_deadline).toLocaleDateString() : "Not set"}
                    </div>
                    <div className="mt-2">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-medium border ${
                          open
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-neutral-100 text-neutral-700 border-neutral-300"
                        }`}
                      >
                        {open ? "Open" : "Closed"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex gap-3">
                  <Link
                    to={`/tender/${t.tender_id}`}
                    className="text-primary-600 text-sm hover:underline"
                  >
                    View Tender
                  </Link>
                  {existing ? (
                    <button
                      onClick={() => navigate(`/bidder/proposals/${existing.proposal_id}`)}
                      className="text-primary-700 text-sm hover:underline"
                    >
                      View Proposal
                    </button>
                  ) : (
                    <button
                      onClick={() => startProposal(t.tender_id)}
                      disabled={actionId === t.tender_id}
                      className="text-neutral-700 text-sm hover:underline disabled:opacity-50"
                    >
                      {actionId === t.tender_id ? "Starting..." : "Start Proposal"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
