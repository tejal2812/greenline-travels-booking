const Admin = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-accent to-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Admin Panel</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Connect to Supabase to enable admin functionality and database management.
          </p>
          <div className="bg-card border rounded-lg p-8 max-w-md mx-auto">
            <h3 className="text-lg font-semibold mb-4">Admin Features Available After Supabase Integration:</h3>
            <ul className="text-left space-y-2 text-muted-foreground">
              <li>• Manage bus routes and schedules</li>
              <li>• View all bookings and revenue</li>
              <li>• Add/edit bus operators</li>
              <li>• Generate reports and analytics</li>
              <li>• Manage user accounts</li>
              <li>• Real-time booking monitoring</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;