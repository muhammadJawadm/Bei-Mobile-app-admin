import React, { useState } from 'react';
import { FaBell, FaClock, FaCheckCircle, FaPaperPlane, FaUsers, FaExclamationCircle } from 'react-icons/fa';
import { notificationTemplates, notificationHistory } from '../../utils/dummyData';

type NotificationTab = 'send' | 'automated' | 'history';

// Dummy FCM tokens for users (in real app this would come from database)
const dummyUserTokens = [
  { userId: '1', userName: 'John Doe', fcmToken: 'fcm_token_abc123', hasToken: true },
  { userId: '2', userName: 'Jane Smith', fcmToken: 'fcm_token_def456', hasToken: true },
  { userId: '3', userName: 'Bob Johnson', fcmToken: null, hasToken: false },
  { userId: '4', userName: 'Alice Williams', fcmToken: 'fcm_token_ghi789', hasToken: true },
  { userId: '5', userName: 'Charlie Brown', fcmToken: null, hasToken: false },
];

const Notifications: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NotificationTab>('send');
  const [notificationData, setNotificationData] = useState({
    title: '',
    message: '',
    targetUsers: 'all',
  });
  const [sendResult, setSendResult] = useState<{ success: number; failed: number; noToken: string[] } | null>(null);

  const handleSend = () => {
    // Filter users based on target selection
    let eligibleUsers = dummyUserTokens;

    if (notificationData.targetUsers === 'active') {
      eligibleUsers = dummyUserTokens.filter(u => u.hasToken); // Only users with tokens are "active"
    } else if (notificationData.targetUsers === 'inactive') {
      eligibleUsers = dummyUserTokens.filter(u => !u.hasToken);
    }

    // Check FCM tokens and separate users
    const usersWithTokens = eligibleUsers.filter(u => u.hasToken);
    const usersWithoutTokens = eligibleUsers.filter(u => !u.hasToken);

    // Simulate sending notification
    const result = {
      success: usersWithTokens.length,
      failed: 0,
      noToken: usersWithoutTokens.map(u => u.userName),
    };

    setSendResult(result);

    // Show results
    setTimeout(() => {
      setSendResult(null);
      setNotificationData({ title: '', message: '', targetUsers: 'all' });
    }, 5000);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
        <p className="text-gray-600 mt-1">Send push notifications and manage automated reminders</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Sent Today</p>
              <p className="text-2xl font-bold text-gray-900">247</p>
            </div>
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <FaPaperPlane className="text-indigo-600 text-xl" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Delivered</p>
              <p className="text-2xl font-bold text-green-600">
                {notificationHistory.filter(n => n.status === 'Delivered').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <FaCheckCircle className="text-green-600 text-xl" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">
                {notificationHistory.filter(n => n.status === 'Pending').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <FaClock className="text-yellow-600 text-xl" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Templates</p>
              <p className="text-2xl font-bold text-indigo-600">{notificationTemplates.length}</p>
            </div>
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <FaBell className="text-indigo-600 text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab('send')}
              className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${activeTab === 'send'
                ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
            >
              Send Notification
            </button>
            <button
              onClick={() => setActiveTab('automated')}
              className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${activeTab === 'automated'
                ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
            >
              Automated Reminders
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${activeTab === 'history'
                ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
            >
              History
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Send Notification Tab */}
          {activeTab === 'send' && (
            <div className="max-w-2xl">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Create & Send Notification</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={notificationData.title}
                    onChange={(e) => setNotificationData({ ...notificationData, title: e.target.value })}
                    placeholder="Notification title"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    value={notificationData.message}
                    onChange={(e) => setNotificationData({ ...notificationData, message: e.target.value })}
                    rows={4}
                    placeholder="Enter your notification message..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Target Audience
                  </label>
                  <select
                    value={notificationData.targetUsers}
                    onChange={(e) => setNotificationData({ ...notificationData, targetUsers: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="all">All Users</option>
                    <option value="active">Active Users Only</option>
                    <option value="inactive">Inactive Users Only</option>
                    <option value="custom">Custom Selection</option>
                  </select>
                </div>

                {/* FCM Token Status Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <FaBell className="text-blue-600 mt-1" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-blue-900">FCM Token Validation</p>
                      <p className="text-xs text-blue-700 mt-1">
                        Notifications will only be sent to users with valid FCM tokens.
                        Users without tokens: {dummyUserTokens.filter(u => !u.hasToken).map(u => u.userName).join(', ')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Send Result */}
                {sendResult && (
                  <div className={`rounded-lg p-4 ${sendResult.noToken.length > 0
                      ? 'bg-yellow-50 border border-yellow-200'
                      : 'bg-green-50 border border-green-200'
                    }`}>
                    <div className="flex items-start gap-2">
                      {sendResult.noToken.length > 0 ? (
                        <FaExclamationCircle className="text-yellow-600 mt-1" />
                      ) : (
                        <FaCheckCircle className="text-green-600 mt-1" />
                      )}
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${sendResult.noToken.length > 0 ? 'text-yellow-900' : 'text-green-900'
                          }`}>
                          Notification Send Result
                        </p>
                        <div className="text-xs mt-2 space-y-1">
                          <p className="text-green-700">✅ Successfully sent: {sendResult.success} users</p>
                          {sendResult.failed > 0 && (
                            <p className="text-red-700">❌ Failed: {sendResult.failed} users</p>
                          )}
                          {sendResult.noToken.length > 0 && (
                            <p className="text-yellow-700">
                              ⚠️ No FCM token ({sendResult.noToken.length}): {sendResult.noToken.join(', ')}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleSend}
                  disabled={!notificationData.title || !notificationData.message}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaPaperPlane />
                  <span>Send Notification</span>
                </button>
              </div>
            </div>
          )}

          {/* Automated Reminders Tab */}
          {activeTab === 'automated' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Automated Reminder Templates</h2>
                <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                  <FaBell />
                  <span>Create Template</span>
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {notificationTemplates.map((template) => (
                  <div
                    key={template.id}
                    className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg border border-indigo-200 p-6"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${template.type === 'Reminder' ? 'bg-blue-100 text-blue-800' :
                        template.type === 'Motivation' ? 'bg-green-100 text-green-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                        {template.type}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-4 text-sm">{template.message}</p>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="bg-white rounded-lg p-2">
                        <p className="text-xs text-gray-600">Frequency</p>
                        <p className="font-medium text-gray-900">{template.frequency}</p>
                      </div>
                      {template.time && (
                        <div className="bg-white rounded-lg p-2">
                          <p className="text-xs text-gray-600">Time</p>
                          <p className="font-medium text-gray-900">{template.time}</p>
                        </div>
                      )}
                      {template.trigger && (
                        <div className="bg-white rounded-lg p-2 col-span-2">
                          <p className="text-xs text-gray-600">Trigger</p>
                          <p className="font-medium text-gray-900">{template.trigger}</p>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button className="flex-1 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm">
                        Edit
                      </button>
                      <button className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm">
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Notification History</h2>
              <div className="space-y-3">
                {notificationHistory.map((notification) => (
                  <div
                    key={notification.id}
                    className="bg-gray-50 rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                            <FaUsers className="text-indigo-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{notification.userName}</p>
                            <p className="text-xs text-gray-500">{notification.sentDate}</p>
                          </div>
                        </div>
                        <p className="text-gray-700 ml-13">{notification.message}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${notification.status === 'Delivered'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                          }`}>
                          {notification.status}
                        </span>
                        {notification.readDate && (
                          <span className="text-xs text-gray-500">Read: {notification.readDate}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
