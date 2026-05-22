DEMO_DATA = {
    "delhi": {
        "sponsor": {
            "sponsors": [
                {
                    "rank": 1,
                    "company_name": "Google Cloud India",
                    "industry": "Cloud Computing & AI",
                    "relevance_score": 9.5,
                    "estimated_budget": "₹10L - ₹15L",
                    "contact_info": {"email": "partnerships-in@google.com", "linkedin": "linkedin.com/company/google-cloud"},
                    "rationale": "High interest in AI ecosystems in India.",
                    "outreach_email": "Subject: Partnership for AI Summit India\n\nHi Team,\n\nWe would love to have Google Cloud as our presenting sponsor..."
                },
                {
                    "rank": 2,
                    "company_name": "Infosys",
                    "industry": "IT Services",
                    "relevance_score": 8.8,
                    "estimated_budget": "₹5L - ₹10L",
                    "contact_info": {"email": "sponsorships@infosys.com", "linkedin": "linkedin.com/company/infosys"},
                    "rationale": "Strong push for enterprise AI solutions.",
                    "outreach_email": "Subject: Sponsorship Opportunity - AI Summit India\n\nHi Team,\n\nWe believe Infosys would be a great fit..."
                }
            ],
            "total_found": 15,
            "search_queries_used": ["AI companies in India", "Top cloud providers India"]
        },
        "speaker": {
            "speakers": [
                {
                    "name": "Dr. Ramesh Raskar",
                    "title": "Associate Professor",
                    "organization": "MIT Media Lab",
                    "relevance_score": 9.8,
                    "influence_score": 9.5,
                    "topics": ["AI for Good", "Computational Photography"],
                    "suggested_slot": "Morning Keynote",
                    "bio_summary": "Pioneer in computer vision and machine learning.",
                    "source_url": "https://media.mit.edu/people/raskar/"
                },
                {
                    "name": "Nandan Nilekani",
                    "title": "Co-Founder",
                    "organization": "Infosys",
                    "relevance_score": 9.2,
                    "influence_score": 9.9,
                    "topics": ["Digital Public Infrastructure", "AI at Scale"],
                    "suggested_slot": "Afternoon Keynote",
                    "bio_summary": "Architect of India's digital identity system (Aadhaar).",
                    "source_url": "https://en.wikipedia.org/wiki/Nandan_Nilekani"
                }
            ],
            "agenda_mapping": [
                {"time_slot": "09:30 AM", "speaker": "Dr. Ramesh Raskar", "topic": "The Future of AI for Good"},
                {"time_slot": "02:00 PM", "speaker": "Nandan Nilekani", "topic": "Building AI at Population Scale"}
            ]
        },
        "ticketing": {
            "tiers": [
                {"tier": "Early Bird", "price": 2500.0, "availability": "First 100", "perks": ["Access to all sessions", "Lunch included"]},
                {"tier": "General Admission", "price": 4000.0, "availability": "Until sold out", "perks": ["Access to all sessions", "Lunch included"]},
                {"tier": "VIP", "price": 10000.0, "availability": "50 tickets", "perks": ["Front row seating", "Exclusive networking dinner", "Speaker lounge access"]}
            ],
            "conversion_estimates": {"Early Bird": 0.25, "General Admission": 0.15, "VIP": 0.05},
            "recommended_platform": "Townscript",
            "notes": "Townscript is highly popular in India with good UPI integration."
        },
        "venue": {
            "venues": [
                {
                    "rank": 1,
                    "name": "Bharat Mandapam (Pragati Maidan)",
                    "address": "Pragati Maidan, New Delhi, Delhi 110001",
                    "city": "Delhi",
                    "capacity": 3000,
                    "estimated_cost": "₹15L - ₹20L per day",
                    "rating": 4.8,
                    "pros": ["World-class facilities", "Central location", "Metro connectivity"],
                    "cons": ["High cost", "Stringent booking procedures"],
                    "google_maps_url": "https://goo.gl/maps/xyz",
                    "google_place_id": "ChIJxyz"
                },
                {
                    "rank": 2,
                    "name": "Yashobhoomi (IICC)",
                    "address": "Sector 25 Dwarka, New Delhi, Delhi 110061",
                    "city": "Delhi",
                    "capacity": 5000,
                    "estimated_cost": "₹12L - ₹18L per day",
                    "rating": 4.7,
                    "pros": ["Brand new infrastructure", "Close to airport"],
                    "cons": ["Far from city center"],
                    "google_maps_url": "https://goo.gl/maps/abc",
                    "google_place_id": "ChIJabc"
                }
            ]
        },
        "pricing": {
            "pricing_tiers": [
                {"tier": "Early Bird", "price": 2500.0, "availability": "First 100"},
                {"tier": "General", "price": 4000.0, "availability": "600"},
                {"tier": "VIP", "price": 10000.0, "availability": "50"}
            ],
            "attendance_forecast": {
                "expected_total": 750,
                "confidence_range": [650, 800],
                "chart_data": [
                    {"week": "W1", "cumulative": 100, "weekly": 100},
                    {"week": "W2", "cumulative": 250, "weekly": 150},
                    {"week": "W3", "cumulative": 450, "weekly": 200},
                    {"week": "W4", "cumulative": 750, "weekly": 300}
                ]
            },
            "revenue_estimate": {"low": 2000000.0, "expected": 2800000.0, "high": 3500000.0}
        },
        "gtm": {
            "channels": [
                {"channel": "LinkedIn", "strategy": "Targeted ads to AI professionals in NCR", "message_template": "Join India's leading AI minds...", "target_communities": ["AI India Network"]},
                {"channel": "Twitter", "strategy": "Engage with tech influencers", "message_template": "Don't miss the biggest AI event in Delhi...", "target_communities": ["#AITwitter"]}
            ],
            "timeline": [
                {"phase": "Pre-launch", "action": "Teaser campaign on LinkedIn"},
                {"phase": "Launch", "action": "Early bird ticket announcement"}
            ],
            "key_messages": ["India's AI Revolution", "Networking with Top AI Leaders"]
        },
        "ops": {
            "run_of_show": [
                {"time": "08:00 AM", "task": "Registration Desk Opens", "owner": "Ops Team", "notes": "Ensure 5 check-in counters"},
                {"time": "09:30 AM", "task": "Opening Keynote", "owner": "Event Manager", "notes": "AV check 15 mins prior"}
            ],
            "vendor_checklist": ["Catering (Lunch & Tea)", "AV Provider", "Lanyard Printing", "WiFi Setup"],
            "contingency_plans": ["Backup generator for power cuts", "Extra 50 chairs on standby"]
        }
    },
    "new_york": {
        "sponsor": {
            "sponsors": [
                {
                    "rank": 1,
                    "company_name": "Stripe",
                    "industry": "Fintech / SaaS",
                    "relevance_score": 9.7,
                    "estimated_budget": "$20k - $50k",
                    "contact_info": {"email": "events@stripe.com", "linkedin": "linkedin.com/company/stripe"},
                    "rationale": "Leading infrastructure for SaaS platforms.",
                    "outreach_email": "Subject: Partnership for SaaS Growth Summit NY\n\nHi Team,\n\nWe would love to have Stripe as a sponsor..."
                },
                {
                    "rank": 2,
                    "company_name": "Datadog",
                    "industry": "Cloud Monitoring",
                    "relevance_score": 9.2,
                    "estimated_budget": "$15k - $30k",
                    "contact_info": {"email": "sponsorships@datadoghq.com", "linkedin": "linkedin.com/company/datadog"},
                    "rationale": "HQ in NYC, strong presence in SaaS ecosystem.",
                    "outreach_email": "Subject: Sponsorship Opportunity - SaaS Growth Summit\n\nHi Team,\n\nDatadog's tools are essential for SaaS..."
                }
            ],
            "total_found": 25,
            "search_queries_used": ["Top SaaS companies NYC", "B2B SaaS sponsors"]
        },
        "speaker": {
            "speakers": [
                {
                    "name": "Jason Lemkin",
                    "title": "Founder",
                    "organization": "SaaStr",
                    "relevance_score": 9.9,
                    "influence_score": 9.8,
                    "topics": ["Scaling from $1M to $10M ARR", "SaaS Metrics"],
                    "suggested_slot": "Opening Keynote",
                    "bio_summary": "The godfather of modern SaaS content and events.",
                    "source_url": "https://www.saastr.com/"
                },
                {
                    "name": "Elena Verna",
                    "title": "Growth Advisor",
                    "organization": "Various",
                    "relevance_score": 9.6,
                    "influence_score": 9.5,
                    "topics": ["PLG vs SLG", "B2B Growth Loops"],
                    "suggested_slot": "Morning Workshop",
                    "bio_summary": "Leading expert on Product-Led Growth for B2B SaaS.",
                    "source_url": "https://elenaverna.com/"
                }
            ],
            "agenda_mapping": [
                {"time_slot": "09:00 AM", "speaker": "Jason Lemkin", "topic": "Scaling your SaaS in 2026"},
                {"time_slot": "11:00 AM", "speaker": "Elena Verna", "topic": "The Future of Product-Led Growth"}
            ]
        },
        "ticketing": {
            "tiers": [
                {"tier": "Super Early Bird", "price": 299.0, "availability": "First 100", "perks": ["Full Access"]},
                {"tier": "General Admission", "price": 599.0, "availability": "Until sold out", "perks": ["Full Access", "Happy Hour"]},
                {"tier": "All-Access Pass", "price": 999.0, "availability": "100 tickets", "perks": ["VIP Dinner", "Speaker Lounge", "Recordings"]}
            ],
            "conversion_estimates": {"Super Early Bird": 0.4, "General Admission": 0.5, "All-Access": 0.1},
            "recommended_platform": "Luma",
            "notes": "Luma is standard for tech events in NYC right now."
        },
        "venue": {
            "venues": [
                {
                    "rank": 1,
                    "name": "Javits Center",
                    "address": "429 11th Ave, New York, NY 10001",
                    "city": "New York",
                    "capacity": 5000,
                    "estimated_cost": "$50k - $100k",
                    "rating": 4.6,
                    "pros": ["Massive space", "Iconic location", "Hudson Yards adjacent"],
                    "cons": ["Expensive", "Union labor rules"],
                    "google_maps_url": "https://goo.gl/maps/javits",
                    "google_place_id": "ChIJjavits"
                },
                {
                    "rank": 2,
                    "name": "Convene (Midtown West)",
                    "address": "117 W 46th St, New York, NY 10036",
                    "city": "New York",
                    "capacity": 800,
                    "estimated_cost": "$25k - $40k",
                    "rating": 4.8,
                    "pros": ["Premium tech setup", "In-house catering", "Turnkey solution"],
                    "cons": ["Capacity limit", "No outside food allowed"],
                    "google_maps_url": "https://goo.gl/maps/convene",
                    "google_place_id": "ChIJconvene"
                }
            ]
        },
        "pricing": {
            "pricing_tiers": [
                {"tier": "Super Early Bird", "price": 299.0, "availability": "100"},
                {"tier": "General", "price": 599.0, "availability": "800"},
                {"tier": "All-Access", "price": 999.0, "availability": "100"}
            ],
            "attendance_forecast": {
                "expected_total": 950,
                "confidence_range": [850, 1000],
                "chart_data": [
                    {"week": "W1", "cumulative": 200, "weekly": 200},
                    {"week": "W2", "cumulative": 450, "weekly": 250},
                    {"week": "W3", "cumulative": 750, "weekly": 300},
                    {"week": "W4", "cumulative": 950, "weekly": 200}
                ]
            },
            "revenue_estimate": {"low": 350000.0, "expected": 520000.0, "high": 600000.0}
        },
        "gtm": {
            "channels": [
                {"channel": "Twitter", "strategy": "VC & Founder Engagement", "message_template": "Bringing the best of SaaS to NYC...", "target_communities": ["#SaaS", "NYC Tech"]},
                {"channel": "Newsletters", "strategy": "Sponsored slots in TLDR and Term Sheet", "message_template": "Early bird ends Friday for the SaaS Growth Summit", "target_communities": ["Founders", "Growth Marketers"]}
            ],
            "timeline": [
                {"phase": "Pre-launch", "action": "Announce speakers"},
                {"phase": "Launch", "action": "Open ticket sales"}
            ],
            "key_messages": ["Scale to $100M", "Connect with NYCs Top Founders"]
        },
        "ops": {
            "run_of_show": [
                {"time": "08:00 AM", "task": "Doors Open & Breakfast", "owner": "Ops Team", "notes": "Coffee stations must be ready"},
                {"time": "09:00 AM", "task": "Opening Remarks", "owner": "Event Manager", "notes": "MC intro"}
            ],
            "vendor_checklist": ["Catering (Breakfast, Lunch, Happy Hour)", "AV & Livestream", "Badges", "Security"],
            "contingency_plans": ["Internet failover via 5G hotspot", "Backup MC"]
        }
    }
}
