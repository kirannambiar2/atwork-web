import React from "react";
import Layout from "./Layout";

const Support = () => {
  return (
    <Layout title="Support">
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-6 py-12">
          <div className="prose max-w-none">
            <h2 className="text-2xl font-semibold mb-4">Contact Support</h2>
            <p className="text-lg mb-4">
              For any issues you face please contact
              customersupport@atworkindia.com and we'll do our best to get back
              to you at the earliest.
            </p>

            <div className="bg-gray-50 p-6 rounded-lg mt-8">
              <h3 className="text-xl font-semibold mb-4">Support Hours</h3>
              <p>Monday - Friday: 9:00 AM - 6:00 PM IST</p>
              <p>Response Time: Within 24 hours</p>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Email Support</h3>
              <a
                href="mailto:customersupport@atworkindia.com"
                className="text-primary hover:underline"
              >
                customersupport@atworkindia.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Support;
