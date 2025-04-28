import React from "react";
import { Card } from "primereact/card";
import { Timeline } from "primereact/timeline";
import { Tag } from "primereact/tag";
import { Image } from "primereact/image";
import { Divider } from "primereact/divider";

const MyOrders2=({deliveries}) =>{
  console.log("deliveries",deliveries)
  // Render a single delivery card
  const renderDelivery = (delivery) => {
    const orderDate = new Date(delivery.createdAt).toLocaleDateString();
    const statusColors = {
      "waiting to be delivered": "warning",
      "on the way": "info",
      arrived: "success",
      recieved: "success",
    };

    return (
      <Card
        key={delivery._id}
        title={`Order Date: ${orderDate}`}
        subTitle={`Status: `}
        className="p-mb-3"
      >
        {/* Add status with a Tag */}
        <Tag
          value={delivery.status}
          severity={statusColors[delivery.status]}
        ></Tag>

        <Divider />

        {/* Render the list of air-conditioners */}
        <div className="p-grid">
          {delivery.purchase.products.map((shoppingBagItem) => (
            <div
              key={shoppingBagItem._id}
              className="p-col-12 p-md-4 p-lg-3"
              style={{ textAlign: "center" }}
            >
              <Image
                src={shoppingBagItem.product.imagepath}
                alt={shoppingBagItem.product.title}
                width="100"
                preview
              />
              <p>{shoppingBagItem.product.title}</p>
            </div>
          ))}
        </div>
      </Card>
    );
  };

  // Render the deliveries list
  return (
    <div className="my-orders">
      <h2>My Orders</h2>
      {deliveries.map((delivery) => renderDelivery(delivery))}
    </div>
  );
}

export default MyOrders2;