"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { TbSearch, TbMapPin, TbAdjustmentsHorizontal, TbX, TbPackage } from "react-icons/tb";
import { publicApi } from "@/lib/api";
import { CATEGORIES, RENTAL_TYPES, SORT_OPTIONS } from "@/lib/constants";
import EquipmentCard, { EquipmentCardSkeleton } from "./EquipmentCard";
import Pagination from "@/components/shared/Pagination";

const DEFAULTS = { search: "", location: "", category: "", rentalType: "", minPrice: "", maxPrice: "", availability: "", sort: "newest", page: "1" };
const KEYS = Object.keys(DEFAULTS);

function useDebounced(value, delay = 400) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}

export default function AllEquipmentClient() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  // URL is the source of truth → filters are shareable & survive reloads
  const filters = useMemo(() => Object.fromEntries(KEYS.map((k) => [k, params.get(k) ?? DEFAULTS[k]])), [params]);

  const [searchInput, setSearchInput] = useState(filters.search);
  const [locationInput, setLocationInput] = useState(filters.location);
  const [priceInput, setPriceInput] = useState({ min: filters.minPrice, max: filters.maxPrice });
  const [drawer, setDrawer] = useState(false);
  const debSearch = useDebounced(searchInput);
  const debLocation = useDebounced(locationInput);
  const debPrice = useDebounced(priceInput, 600);

  const update = (patch, resetPage = true) => {
    const next = { ...filters, ...patch };
    if (resetPage && !("page" in patch)) next.page = "1";
    const qs = new URLSearchParams();
    KEYS.forEach((k) => {
      if (next[k] && next[k] !== DEFAULTS[k]) qs.set(k, next[k]);
    });
    router.replace(`${pathname}${qs.toString() ? `?${qs}` : ""}`, { scroll: false });
  };

  useEffect(() => {
    if (debSearch !== filters.search) update({ search: debSearch });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debSearch]);
  useEffect(() => {
    if (debLocation !== filters.location) update({ location: debLocation });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debLocation]);
  useEffect(() => {
    if (debPrice.min !== filters.minPrice || debPrice.max !== filters.maxPrice) update({ minPrice: debPrice.min, maxPrice: debPrice.max });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debPrice]);

  const { data, isLoading, isFetching, isError, refetch } = useQuery({
    queryKey: ["equipment", filters],
    queryFn: async () => (await publicApi.get("/equipment", { params: { ...filters, limit: 9 } })).data,
    placeholderData: keepPreviousData,
  });

  const page = Number(filters.page) || 1;
  const activeChips = [
    filters.search && { k: "search", label: `“${filters.search}”` },
    filters.location && { k: "location", label: `📍 ${filters.location}` },
    filters.category && { k: "category", label: filters.category },
    filters.rentalType && { k: "rentalType", label: `${filters.rentalType} rate` },
    (filters.minPrice || filters.maxPrice) && { k: "price", label: `$${filters.minPrice || 0} – ${filters.maxPrice ? `$${filters.maxPrice}` : "any"}` },
    filters.availability && { k: "availability", label: filters.availability === "available" ? "Available now" : "Booked out" },
  ].filter(Boolean);

  const clearChip = (k) => {
    if (k === "search") setSearchInput("");
    if (k === "location") setLocationInput("");
    if (k === "price") {
      setPriceInput({ min: "", max: "" });
      return update({ minPrice: "", maxPrice: "" });
    }
    update({ [k]: "" });
  };

  const clearAll = () => {
    setSearchInput("");
    setLocationInput("");
    setPriceInput({ min: "", max: "" });
    router.replace(pathname, { scroll: false });
  };

  const FilterPanel = (
    <div className="space-y-6">
      <div>
        <p className="mb-3 text-sm font-bold uppercase tracking-wider text-base-content/60">Category</p>
        <div className="space-y-1">
          {[{ name: "", short: "All categories" }, ...CATEGORIES].map((c) => (
            <label key={c.name || "all"} className="flex cursor-pointer items-center gap-3 rounded-xl px-2 py-1.5 hover:bg-base-200">
              <input
                type="radio"
                name="category"
                className="radio radio-sm radio-primary"
                checked={filters.category === c.name}
                onChange={() => update({ category: c.name })}
              />
              <span className="text-sm font-medium">{c.name || c.short}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-3 text-sm font-bold uppercase tracking-wider text-base-content/60">Rental type</p>
        <div className="flex flex-wrap gap-2">
          {[{ value: "", label: "Any" }, ...RENTAL_TYPES].map((r) => (
            <button
              key={r.value || "any"}
              onClick={() => update({ rentalType: r.value })}
              className={`btn btn-sm rounded-full ${filters.rentalType === r.value ? "btn-secondary" : "btn-outline border-base-300"}`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-3 text-sm font-bold uppercase tracking-wider text-base-content/60">Price range ($)</p>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="0"
            placeholder="Min"
            className="input input-sm w-full"
            value={priceInput.min}
            onChange={(e) => setPriceInput((p) => ({ ...p, min: e.target.value }))}
          />
          <span className="text-base-content/40">–</span>
          <input
            type="number"
            min="0"
            placeholder="Max"
            className="input input-sm w-full"
            value={priceInput.max}
            onChange={(e) => setPriceInput((p) => ({ ...p, max: e.target.value }))}
          />
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {[
            ["0", "50"],
            ["50", "150"],
            ["150", ""],
          ].map(([min, max]) => (
            <button key={min + max} className="badge badge-outline cursor-pointer hover:badge-primary" onClick={() => setPriceInput({ min, max })}>
              {max ? `$${min}–${max}` : `$${min}+`}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-3 text-sm font-bold uppercase tracking-wider text-base-content/60">Availability</p>
        <select className="select select-sm w-full" value={filters.availability} onChange={(e) => update({ availability: e.target.value })}>
          <option value="">Any</option>
          <option value="available">Available now</option>
          <option value="unavailable">Booked out</option>
        </select>
      </div>

      {activeChips.length > 0 && (
        <button className="btn btn-ghost btn-sm w-full text-error" onClick={clearAll}>
          Clear all filters
        </button>
      )}
    </div>
  );

  return (
    <div className="container-x py-10">
      {/* search bar */}
      <div className="card-surface flex flex-col gap-2 p-2 md:flex-row md:rounded-full">
        <label className="flex flex-1 items-center gap-2 px-4">
          <TbSearch className="shrink-0 text-xl text-base-content/50" />
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by equipment name, brand or category…"
            className="h-12 w-full bg-transparent outline-none"
            aria-label="Search equipment by name"
          />
        </label>
        <label className="flex items-center gap-2 border-base-300 px-4 md:w-72 md:border-l">
          <TbMapPin className="shrink-0 text-xl text-base-content/50" />
          <input
            value={locationInput}
            onChange={(e) => setLocationInput(e.target.value)}
            placeholder="Location (e.g. Dhaka)"
            className="h-12 w-full bg-transparent outline-none"
            aria-label="Search by location"
          />
        </label>
        <select
          className="select h-12 rounded-full border-0 bg-base-200 md:w-56"
          value={filters.sort}
          onChange={(e) => update({ sort: e.target.value })}
          aria-label="Sort"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <button className="btn btn-secondary h-12 rounded-full lg:hidden" onClick={() => setDrawer(true)}>
          <TbAdjustmentsHorizontal /> Filters {activeChips.length ? `(${activeChips.length})` : ""}
        </button>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="hidden lg:block">
          <div className="card-surface sticky top-24 p-5">
            <p className="mb-5 flex items-center gap-2 font-display text-lg font-bold">
              <TbAdjustmentsHorizontal /> Filters
            </p>
            {FilterPanel}
          </div>
        </aside>

        <div>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-base-content/70">
              {isLoading ? "Loading…" : <><b className="text-base-content">{data?.total ?? 0}</b> equipment found</>}
              {isFetching && !isLoading && <span className="loading loading-dots loading-xs ml-2 align-middle" />}
            </p>
            <div className="flex flex-wrap gap-2">
              {activeChips.map((c) => (
                <button key={c.k} onClick={() => clearChip(c.k)} className="badge badge-lg gap-1 border-base-300 bg-base-200 capitalize">
                  {c.label} <TbX />
                </button>
              ))}
            </div>
          </div>

          {isError ? (
            <div className="card-surface flex flex-col items-center gap-3 py-20 text-center">
              <p className="font-semibold">We couldn&apos;t load equipment right now.</p>
              <button className="btn btn-primary btn-rig btn-sm" onClick={() => refetch()}>
                Try again
              </button>
            </div>
          ) : isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <EquipmentCardSkeleton key={i} />
              ))}
            </div>
          ) : data?.items?.length ? (
            <>
              <div className={`grid gap-6 sm:grid-cols-2 xl:grid-cols-3 transition-opacity ${isFetching ? "opacity-60" : ""}`}>
                {data.items.map((item, i) => (
                  <EquipmentCard key={item._id} item={item} index={i} />
                ))}
              </div>
              <Pagination
                className="mt-10"
                page={page}
                totalPages={data.totalPages}
                onChange={(p) => {
                  update({ page: String(p) }, false);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            </>
          ) : (
            <div className="card-surface flex flex-col items-center gap-3 py-20 text-center">
              <TbPackage className="text-5xl text-base-content/25" />
              <p className="text-lg font-bold">No equipment matches your filters</p>
              <p className="text-sm text-base-content/60">Try a different keyword or clear some filters.</p>
              <button className="btn btn-outline btn-sm rounded-full" onClick={clearAll}>
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* mobile filter drawer */}
      {drawer && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <button className="absolute inset-0 bg-black/40" onClick={() => setDrawer(false)} aria-label="Close filters" />
          <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-base-100 p-6">
            <div className="mb-5 flex items-center justify-between">
              <p className="font-display text-xl font-bold">Filters</p>
              <button className="btn btn-ghost btn-circle btn-sm" onClick={() => setDrawer(false)}>
                <TbX />
              </button>
            </div>
            {FilterPanel}
            <button className="btn btn-primary btn-rig mt-6 w-full" onClick={() => setDrawer(false)}>
              Show {data?.total ?? ""} results
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
