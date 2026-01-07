import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import { tenderService } from "../../../services/tenderService";
import PageHeader from "../../../components/shared/PageHeader";
import StatsCard from "./components/StatsCard";
import DraftTenderList from "./components/DraftTenderList";
import PublishedTenderList from "./components/PublishedTenderList";

export default function Dashboard() {
  const { token } = useAuth();
  const [tenders, setTenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadTenders() {
      setLoading(true);
      try {
        const { tenders: data } = await tenderService.listTenders(token);
        setTenders(data);
      } catch (err) {
        setError(err.message || "Failed to load tenders");
      } finally {
        setLoading(false);
      }
    }
    if (token) loadTenders();
  }, [token]);

  const drafts = useMemo(() => tenders.filter(t => t.status === 'DRAFT'), [tenders]);
  const published = useMemo(() => tenders.filter(t => t.status === 'PUBLISHED'), [tenders]);

  const upcomingCount = useMemo(() => {
    const now = Date.now();
    const within = 1000 * 60 * 60 * 24 * 7;
    return published.filter(
      (t) =>
        new Date(t.submission_deadline).getTime() - now <= within &&
        new Date(t.submission_deadline).getTime() - now > 0
    ).length;
  }, [published]);

  const handleDeleteDraft = (id) => {
    setTenders((prev) => prev.filter((t) => t.tender_id !== id));
  };

  return (
    <div className="px-6 py-6 mx-auto max-w-7xl">
      <PageHeader
        title="Dashboard"
        description="Manage and publish your tenders from a single place."
        actions={
          <Link
            to="/admin/tender/create"
            className="inline-flex items-center px-4 py-2 rounded-md bg-primary-600 text-white text-sm font-semibold shadow hover:bg-primary-700 transition-colors"
          >
            Create New Tender
          </Link>
        }
      />

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Overview Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-10">
        <StatsCard title="Draft Tenders" value={drafts.length} tone="neutral" />
        <StatsCard
          title="Published Tenders"
          value={published.length}
          tone="positive"
        />
        <StatsCard
          title="Upcoming Deadlines"
          value={upcomingCount}
          tone="warning"
        />
      </section>

      {/* Drafts */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-neutral-900">
            Draft Tenders
          </h2>
        </div>
        {loading ? (
          <div className="text-sm text-neutral-600">Loading...</div>
        ) : drafts.length === 0 ? (
          <div className="text-sm text-neutral-600">No draft tenders.</div>
        ) : (
          <DraftTenderList drafts={drafts.map(t => ({ id: t.tender_id, title: t.title, updatedAt: t.created_at }))} onDelete={handleDeleteDraft} />
        )}
      </section>

      {/* Published */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-neutral-900">
            Published Tenders
          </h2>
        </div>
        {loading ? (
          <div className="text-sm text-neutral-600">Loading...</div>
        ) : published.length === 0 ? (
          <div className="text-sm text-neutral-600">No published tenders.</div>
        ) : (
          <PublishedTenderList tenders={published.map(t => ({ id: t.tender_id, title: t.title, publishedAt: t.created_at, deadline: t.submission_deadline }))} />
        )}
      </section>
    </div>
  );
}
