import { createRoot } from "react-dom/client";
import Modal from "./modal";
import type { IModalOptions } from "./types";

const activeModals: { close: () => void }[] = [];

export const closeModal = () => {
  const lastModal = activeModals[activeModals.length - 1];
  if (lastModal) lastModal.close();
};

const showModal = <H, C, A>(options: IModalOptions<H, C, A>) => {
  const container = document.createElement("div");
  container.classList.add("hybrid-modal-host");
  document.body.appendChild(container);

  const root = createRoot(container);

  const destroy = () => {
    const index = activeModals.findIndex((m) => m.close === destroy);
    if (index !== -1) activeModals.splice(index, 1);

    root.unmount();
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
  };

  const handleClose = () => {
    if (options.onClose) options.onClose();
    destroy(); // O Modal.tsx já cuidou da animação antes de chamar isso
  };

  activeModals.push({ close: handleClose });

  root.render(<Modal options={options} onClose={handleClose} />);

  return { close: handleClose };
};

export default showModal;
