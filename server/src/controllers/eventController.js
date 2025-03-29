const Event = require("../models/Event");
const User = require("../models/User");

// Create a new event
exports.createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      date,
      price,
      type,
      skills,
      image,
      maxAttendees,
      location,
    } = req.body;

    // Process skills array
    const processedSkills = skills
      ? typeof skills === "string"
        ? skills.split(",").map((s) => s.trim())
        : skills
      : [];

    // Create new event
    const event = new Event({
      title,
      description,
      date,
      price: price || 0,
      type,
      skills: processedSkills,
      image: image || "https://source.unsplash.com/random/800x600?event",
      maxAttendees,
      host: req.user.id,
      location: location || "Online",
    });

    await event.save();

    // Populate host details
    await event.populate("host", "name email");

    res.status(201).json({
      message: "Event created successfully",
      event,
    });
  } catch (error) {
    console.error("Event creation error:", error);
    res.status(500).json({ message: "Server error during event creation" });
  }
};

// Get all events with filtering
exports.getEvents = async (req, res) => {
  try {
    const {
      search,
      type,
      price,
      sort = "date",
      order = "asc",
      limit = 10,
      page = 1,
    } = req.query;

    // Build query
    const query = {};

    // Search by title or description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Filter by type
    if (type && type !== "all") {
      query.type = type;
    }

    // Filter by price
    if (price) {
      if (price === "free") {
        query.price = 0;
      } else if (price === "paid") {
        query.price = { $gt: 0 };
      }
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build sort object
    const sortObj = {};
    sortObj[sort] = order === "asc" ? 1 : -1;

    // Execute query with pagination
    const events = await Event.find(query)
      .populate("host", "name email")
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await Event.countDocuments(query);

    res.json({
      events,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Get events error:", error);
    res.status(500).json({ message: "Server error while fetching events" });
  }
};

// Get a single event by ID
exports.getEvent = async (req, res) => {
  try {
    const eventId = req.params.id;

    // Check if ID is valid
    if (!eventId || eventId === "undefined") {
      return res.status(400).json({ message: "Invalid event ID provided" });
    }

    const event = await Event.findById(req.params.id)
      .populate("host", "name email bio")
      .populate("attendees.user", "name email");

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json({ event });
  } catch (error) {
    console.error("Get event error:", error);
    res.status(500).json({ message: "Server error while fetching event" });
  }
};

// Update an event
exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check if user is the host
    if (event.host.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this event" });
    }

    const {
      title,
      description,
      date,
      price,
      type,
      skills,
      image,
      maxAttendees,
      location,
    } = req.body;

    const updates = {};

    if (title) updates.title = title;
    if (description) updates.description = description;
    if (date) updates.date = date;
    if (price !== undefined) updates.price = price;
    if (type) updates.type = type;

    if (skills) {
      updates.skills =
        typeof skills === "string"
          ? skills.split(",").map((s) => s.trim())
          : skills;
    }

    if (image) updates.image = image;
    if (maxAttendees) updates.maxAttendees = maxAttendees;
    if (location) updates.location = location;

    updates.updatedAt = Date.now();

    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).populate("host", "name email");

    res.json({
      message: "Event updated successfully",
      event: updatedEvent,
    });
  } catch (error) {
    console.error("Update event error:", error);
    res.status(500).json({ message: "Server error while updating event" });
  }
};

// Delete an event
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check if user is the host
    if (event.host.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this event" });
    }

    await event.remove();

    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Delete event error:", error);
    res.status(500).json({ message: "Server error while deleting event" });
  }
};

// Register for an event
exports.registerForEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check if user is already registered
    const isRegistered = event.attendees.some(
      (attendee) => attendee.user.toString() === req.user.id
    );

    if (isRegistered) {
      return res
        .status(400)
        .json({ message: "Already registered for this event" });
    }

    // Check if event is full
    if (
      event.attendees.filter((a) => a.status === "confirmed").length >=
      event.maxAttendees
    ) {
      return res.status(400).json({ message: "Event is full" });
    }

    // Add user to attendees
    event.attendees.push({
      user: req.user.id,
      status: "confirmed",
      registeredAt: Date.now(),
    });

    await event.save();

    res.json({
      message: "Successfully registered for event",
      event,
    });
  } catch (error) {
    console.error("Event registration error:", error);
    res.status(500).json({ message: "Server error during event registration" });
  }
};

// Cancel registration for an event
exports.cancelRegistration = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Find attendee index
    const attendeeIndex = event.attendees.findIndex(
      (attendee) => attendee.user.toString() === req.user.id
    );

    if (attendeeIndex === -1) {
      return res.status(400).json({ message: "Not registered for this event" });
    }

    // Remove attendee
    event.attendees.splice(attendeeIndex, 1);

    await event.save();

    res.json({
      message: "Successfully cancelled registration",
      event,
    });
  } catch (error) {
    console.error("Cancel registration error:", error);
    res.status(500).json({ message: "Server error during cancellation" });
  }
};

// Get user's events (registered and hosted)
exports.getUserEvents = async (req, res) => {
  try {
    // Find hosted events
    const hostedEvents = await Event.find({ host: req.user.id })
      .populate("host", "name email")
      .sort({
        date: 1,
      });

    // Find events user is registered for
    const registeredEvents = await Event.find({
      "attendees.user": req.user.id,
    })
      .populate("host", "name email")
      .sort({ date: 1 });

    res.json({
      hosted: hostedEvents,
      registered: registeredEvents,
    });
  } catch (error) {
    console.error("Get user events error:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching user events" });
  }
};
