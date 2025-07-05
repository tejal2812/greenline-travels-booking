const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-accent to-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">User Dashboard</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Connect to Supabase to enable user authentication and booking management.
          </p>
          <div className="bg-card border rounded-lg p-8 max-w-md mx-auto">
            <h3 className="text-lg font-semibold mb-4">Features Available After Supabase Integration:</h3>
            <ul className="text-left space-y-2 text-muted-foreground">
              <li>• View your booking history</li>
              <li>• Cancel or modify bookings</li>
              <li>• Download tickets</li>
              <li>• Manage profile information</li>
              <li>• Get booking notifications</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;