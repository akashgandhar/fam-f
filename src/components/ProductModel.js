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


  const [currentImage, setCurrentImage] = useState(data?.imageUrl);

  return (
    <div>
      <div onClick={onOpenModal}>{children}</div>
      <Modal open={open} onClose={onCloseModal} center>
        <div
          style={{
            padding: "20px",
          }}
          class="w-[800px] max-w-xl mx-auto rounded-md overflow-hidden shadow-md hover:shadow-lg"
        >
          <div
            style={{
              boxShadow: "0 0 10px 0 rgba(0,0,0,0.4)",
              border: "1px solid #f65514",
              borderRadius: "10px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
            class="relative  w-full"
          >
            <img
              style={{
                aspectRatio: "12/9",
                objectFit: "contain",
                width: "700px",
                maxHeight: "400px",
                marginLeft: "'-20px",
              }}
              class="w-full max-h-[300px] rounded-md object-cover"
              src={currentImage}
              alt="Product Image"
            />
            {/* other images in form of thumbnails */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px",
                marginTop: "10px",
              }}
            >
              {data?.additionalImages?.map((item) => (
                <img onClick={() => setCurrentImage(item?.url)}
                  key={item.index}
                  style={{
                    aspectRatio: "12/9",
                    objectFit: "contain",
                    width: "100px",
                    maxHeight: "100px",
                    marginLeft: "'20px",
                  }}
                  class="w-full max-h-[100px] rounded-md object-cover hover:border-orange-500 cursor-pointer"
                  src={item?.url}
                  alt="Product Image"
                />
              ))}
            </div>
          </div>
          <div class="p-4 w-full break-words overflow-hidden">
            <h3 class="text-lg font-medium mb-2">
              {" "}
              {data?.type === "frame"
                ? `${data?.numberOfFrames} Frame Set`
                : data?.name}
            </h3>
            <div
              style={{
                whiteSpace: "break-spaces",
                wordBreak: "break-word",
                wordWrap: "break-word",
                maxWidth: "400px",
              }}
              class="text-gray-600  text-sm mb-4 w-full "
            >
              {data?.description2}
            </div>{" "}
            <div class="flex items-center justify-between">
              <span class="font-bold text-lg">
                ₹ {data?.price}{" "}
                {data?.comparePrice && (
                  <span
                    id="compare price"
                    style={{
                      textDecoration: "line-through",
                      color: "#f65514",
                      marginLeft: "2px",
                    }}
                  >
                    ₹ {data?.comparePrice}
                  </span>
                )}
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
