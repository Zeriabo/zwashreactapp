import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL;

export const updateStripeAccountId = async (providerId, stripeAccountId) => {
  if (!providerId) throw new Error("providerId is required");
  const response = await axios.put(
    `${API_BASE_URL}:8087/v1/service-provider/${providerId}/stripe-account`,
    null,
    {
      params: { stripeAccountId },
    }
  );
  return response.data;
};
