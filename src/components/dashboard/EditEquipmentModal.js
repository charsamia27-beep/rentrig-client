"use client";

import { TbX } from "react-icons/tb";
import EquipmentForm from "./EquipmentForm";

export default function EditEquipmentModal({ item, onClose, onSave, isAdmin = false }) {
  return (
    <div className="modal modal-open" role="dialog" aria-modal="true">
      <div className="modal-box max-h-[92vh] w-11/12 max-w-5xl rounded-3xl">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-extrabold">Update equipment</h3>
            <p className="text-sm text-base-content/60">
              {isAdmin ? "Changes are applied immediately." : "Saving sends the listing back for admin approval."}
            </p>
          </div>
          <button className="btn btn-ghost btn-circle btn-sm" onClick={onClose} aria-label="Close">
            <TbX />
          </button>
        </div>
        <EquipmentForm initial={item} onSubmit={onSave} submitLabel="Save changes" showStatus={!isAdmin} />
      </div>
      <button className="modal-backdrop" onClick={onClose} aria-label="Close" />
    </div>
  );
}
