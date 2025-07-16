// AI Assistant service for intelligent interactions
class AIAssistant {
  constructor() {
    this.context = {
      tasks: [],
      notes: [],
      events: [],
      weather: {}
    };
  }

  async processMessage(message, context = {}) {
    this.context = { ...this.context, ...context };
    
    // Simple AI-like responses based on keywords
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('task') || lowerMessage.includes('todo')) {
      return this.handleTaskQuery(message);
    } else if (lowerMessage.includes('note') || lowerMessage.includes('write')) {
      return this.handleNoteQuery(message);
    } else if (lowerMessage.includes('calendar') || lowerMessage.includes('schedule') || lowerMessage.includes('meeting')) {
      return this.handleCalendarQuery(message);
    } else if (lowerMessage.includes('weather')) {
      return this.handleWeatherQuery(message);
    } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return this.handleGreeting();
    } else {
      return this.handleGeneral(message);
    }
  }

  handleTaskQuery(message) {
    const pendingTasks = this.context.tasks?.filter(task => !task.completed) || [];
    const completedTasks = this.context.tasks?.filter(task => task.completed) || [];
    
    if (message.toLowerCase().includes('pending') || message.toLowerCase().includes('what')) {
      if (pendingTasks.length === 0) {
        return "🎉 Great news! You have no pending tasks. You're all caught up!";
      }
      
      const taskList = pendingTasks.map(task => 
        `• ${task.title} ${task.due_time ? `(due at ${task.due_time})` : ''} - ${task.priority} priority`
      ).join('\n');
      
      return `📋 You have ${pendingTasks.length} pending tasks:\n\n${taskList}\n\nWould you like me to help you prioritize or add a new task?`;
    } else if (message.toLowerCase().includes('add') || message.toLowerCase().includes('create')) {
      return "✨ I'd be happy to help you create a new task! Please provide:\n• Task title\n• Priority (high/medium/low)\n• Due time (optional)\n\nFor example: 'Create presentation - high priority - 2:00 PM'";
    } else if (message.toLowerCase().includes('complete')) {
      return `🎯 You've completed ${completedTasks.length} tasks today. Keep up the excellent work!`;
    }
    
    return "I can help you with tasks! Ask me about pending tasks, completed tasks, or to add new ones.";
  }

  handleNoteQuery(message) {
    const notes = this.context.notes || [];
    
    if (message.toLowerCase().includes('take') || message.toLowerCase().includes('create')) {
      return "📝 I'm ready to help you take a note! What would you like to remember? I can help organize it by category (work, personal, learning).";
    } else if (message.toLowerCase().includes('find') || message.toLowerCase().includes('search')) {
      return "🔍 I can help you find notes! What topic or keyword are you looking for?";
    } else if (message.toLowerCase().includes('summary')) {
      const categories = [...new Set(notes.map(note => note.category))];
      return `📚 You have ${notes.length} notes across ${categories.length} categories: ${categories.join(', ')}. Would you like me to summarize any specific category?`;
    }
    
    return "I can help you take notes, find existing ones, or organize them by category!";
  }

  handleCalendarQuery(message) {
    const events = this.context.events || [];
    const today = new Date();
    const todayEvents = events.filter(event => {
      const eventDate = new Date(event.start_time);
      return eventDate.toDateString() === today.toDateString();
    });
    
    if (message.toLowerCase().includes('today') || message.toLowerCase().includes('schedule')) {
      if (todayEvents.length === 0) {
        return "📅 Your calendar is clear today! Perfect time to focus on your tasks or plan ahead.";
      }
      
      const eventList = todayEvents.map(event => {
        const startTime = new Date(event.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        return `• ${event.title} at ${startTime} ${event.location ? `(${event.location})` : ''}`;
      }).join('\n');
      
      return `📅 Today's schedule:\n\n${eventList}\n\nWould you like me to add a new event or remind you about any of these?`;
    } else if (message.toLowerCase().includes('add') || message.toLowerCase().includes('create')) {
      return "🗓️ I can help you schedule a new event! Please provide:\n• Event title\n• Date and time\n• Location (optional)\n\nFor example: 'Meeting with John - Tomorrow 2:00 PM - Conference Room'";
    }
    
    return "I can help you check your schedule, add events, or set reminders!";
  }

  handleWeatherQuery(message) {
    const weather = this.context.weather;
    
    if (weather && weather.temperature) {
      return `🌤️ Current weather in ${weather.location || 'your area'}:\n• Temperature: ${weather.temperature}°C (feels like ${weather.feelsLike}°C)\n• Conditions: ${weather.condition}\n• Humidity: ${weather.humidity}%\n• Wind: ${weather.windSpeed} km/h\n\nPerfect weather for productivity! 🌟`;
    }
    
    return "🌦️ I can provide weather updates to help you plan your day! The weather widget shows current conditions and forecasts.";
  }

  handleGreeting() {
    const greetings = [
      "👋 Hello! I'm your personal assistant, ready to help you stay organized and productive!",
      "🌟 Hi there! How can I assist you with your tasks, notes, or schedule today?",
      "✨ Greetings! I'm here to help you manage your day efficiently. What would you like to know?",
      "🎯 Hello! Ready to tackle your goals together? Ask me about tasks, notes, or your calendar!"
    ];
    
    return greetings[Math.floor(Math.random() * greetings.length)];
  }

  handleGeneral(message) {
    const responses = [
      "🤔 I'm here to help you with tasks, notes, calendar events, and weather updates. What would you like to know?",
      "✨ I can assist you with organizing your day! Try asking about your pending tasks, creating notes, or checking your schedule.",
      "🎯 I'm your productivity companion! Ask me about tasks, notes, calendar events, or weather information.",
      "📋 I can help you stay organized! Feel free to ask about your tasks, take notes, or check your calendar."
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }

  generateTaskSuggestions(tasks) {
    const pendingTasks = tasks.filter(task => !task.completed);
    const highPriorityTasks = pendingTasks.filter(task => task.priority === 'high');
    
    if (highPriorityTasks.length > 0) {
      return `🔥 Focus suggestion: You have ${highPriorityTasks.length} high-priority tasks. Consider tackling "${highPriorityTasks[0].title}" first!`;
    }
    
    return "🎯 Great job staying on top of your tasks! Keep up the momentum!";
  }
}

export default new AIAssistant();