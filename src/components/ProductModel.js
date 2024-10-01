import React, { useState } from "react";
import ReactDOM from "react-dom";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";

const ProductInfoModel = ({ children, data }) => {
  const [open, setOpen] = useState(false);

  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);

  {
    data && console.log(data);
  }

  return (
    <div>
      <div onClick={onOpenModal}>{children}</div>
      <Modal open={open} onClose={onCloseModal} center>
        <div class="max-w-md mx-auto rounded-md overflow-hidden shadow-md hover:shadow-lg">
          <div class="relative p-4">
            <img
              style={{
                height: "300px",
              }}
              class="w-full"
              src="https://images.unsplash.com/photo-1523275335684-37898b6baf30"
              alt="Product Image"
            />
          </div>
          <div class="p-4  break-words overflow-hidden">
            <h3 class="text-lg font-medium mb-2"> {data?.type === "frame" ?`${data?.numberOfFrames} Frame Set`:data?.name}</h3>
            <div style={{ 
  whiteSpace: 'break-spaces', 
  wordBreak: 'break-word',
  wordWrap: 'break-word',
  maxWidth: '400px'
}} class="text-gray-600  text-sm mb-4 w-full ">
{data?.description2}
</div>            <div class="flex items-center justify-between">
              <span class="font-bold text-lg">
                ₹ {data?.price}{" "}
                {data?.comparePrice &&<span
                  id="compare price"
                  style={{
                    textDecoration: "line-through",
                    color: "#f65514",
                    marginLeft: "2px",
                  }}
                >
                  ₹ {data?.comparePrice }
                </span>}
              </span>
            </div>
            <button
              style={{
                backgroundColor: "#f65514",
                outline: "none",
                border: "none",
                marginTop: "10px",
              }}
              class=" text-white font-bold py-2 px-4 rounded"
            >
              Buy Now
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProductInfoModel;
