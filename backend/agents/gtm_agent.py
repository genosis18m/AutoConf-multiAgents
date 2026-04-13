from crewai import Agent, Task, Crew, LLM
from config import settings
import json
import logging
import re

logger = logging.getLogger(__name__)


def get_llm():
    if settings.groq_api_key:
        return LLM(model="groq/llama-3.3-70b-versatile", api_key=settings.groq_api_key)
    if settings.gemini_api_key:
        return LLM(model="gemini/gemini-2.0-flash", api_key=settings.gemini_api_key)
    raise ValueError("No LLM API key configured.")


async def run_gtm_agent(category: str, geography: str, audience_size: int, speakers: dict = None, pricing: dict = None) -> dict:
    speaker_names = ""
    if speakers and speakers.get("speakers"):
        speaker_names = ", ".join([s["name"] for s in speakers["speakers"][:3]])

    try:
        llm = get_llm()

        agent = Agent(
            role="Go-To-Market Strategy Director",
            goal=f"Build a comprehensive GTM strategy for a {category} conference in {geography}.",
            backstory=(
                "You are a growth marketing expert who has promoted 100+ conferences across Asia, Europe "
                "and the Americas. You know exactly which communities to target, what messages resonate, "
                "and how to build hype on each platform from LinkedIn to niche Discord servers."
            ),
            llm=llm,
            verbose=True,
            max_iter=2,
        )

        task = Task(
            description=f"""
Build a complete Go-To-Market strategy for:
- Conference: {category} Conference in {geography}
- Target audience: {audience_size} attendees
- Featured speakers: {speaker_names or 'TBD'}

Create channel-specific strategies with message templates for:
1. Email marketing
2. LinkedIn
3. Twitter/X
4. Reddit / WhatsApp groups
5. Partner communities

Return ONLY valid JSON:
{{
  "channels": [
    {{
      "channel": "LinkedIn",
      "strategy": "Target {category} professionals via LinkedIn posts and sponsored content",
      "message_template": "Excited to announce {category} Conf {geography} 2026! Join 500+ professionals for 2 days of insights, networking, and innovation. Early bird tickets open now.",
      "target_communities": ["LinkedIn {category} groups", "{geography} Tech Professionals"]
    }},
    {{
      "channel": "Email",
      "strategy": "Drip campaign to existing community list and partner lists",
      "message_template": "Subject: You're invited — {category} Conference {geography} 2026\\n\\nHi [Name],\\n\\nWe're thrilled to invite you...",
      "target_communities": ["Existing subscriber list", "Partner newsletters"]
    }},
    {{
      "channel": "Twitter/X",
      "strategy": "Build hype with speaker announcements, countdown posts, live tweeting",
      "message_template": "🚀 Announcing {category} Conf 2026 in {geography}! 2 days, 10+ speakers, 500+ attendees. Get your early bird ticket before it's gone. Link in bio. #{category}Conf",
      "target_communities": ["#{category}Community", "#{geography}Tech", "#TechEvents"]
    }},
    {{
      "channel": "WhatsApp/Telegram Groups",
      "strategy": "Share with existing {category} community groups in {geography}",
      "message_template": "Hey everyone! We're organising the {category} Conference in {geography}. Would love for you to join! Early bird discount ends this week.",
      "target_communities": ["{category} India groups", "{geography} Startup community", "Developer groups"]
    }},
    {{
      "channel": "Reddit",
      "strategy": "Share on relevant subreddits with value-first approach",
      "message_template": "We're organizing a {category} conference in {geography}. AMA about the planning process + ticket giveaway for 3 active commenters!",
      "target_communities": ["r/{category}", "r/india", "r/startups", "r/programming"]
    }}
  ],
  "timeline": [
    {{"week": "8 weeks before", "action": "Announce event, open Early Bird tickets, post on all channels"}},
    {{"week": "6 weeks before", "action": "Speaker announcement #1, email blast to list"}},
    {{"week": "4 weeks before", "action": "Early Bird closes, Standard tickets open, social media push"}},
    {{"week": "2 weeks before", "action": "Final push, FOMO content, countdown posts"}},
    {{"week": "1 week before", "action": "Logistics email to registered attendees, last-minute promo"}}
  ],
  "key_messages": [
    "The premier {category} conference in {geography}",
    "Learn from top {category} practitioners",
    "Network with {audience_size}+ professionals",
    "Actionable insights you can implement immediately"
  ]
}}
""",
            expected_output="A JSON object with channels, timeline, and key messages.",
            agent=agent,
        )

        crew = Crew(agents=[agent], tasks=[task], verbose=False)
        result = crew.kickoff()
        raw = str(result)

        match = re.search(r'\{[\s\S]*\}', raw)
        if match:
            return json.loads(match.group())

        return _mock_gtm_result(category, geography, audience_size)

    except Exception as e:
        logger.error(f"GTM agent error: {e}")
        return _mock_gtm_result(category, geography, audience_size)


def _mock_gtm_result(category: str, geography: str, audience_size: int) -> dict:
    return {
        "channels": [
            {"channel": "LinkedIn", "strategy": f"Target {category} professionals via organic posts, DMs, and groups", "message_template": f"🚀 Announcing the {category} Conference {geography} 2026! Join {audience_size}+ professionals for 2 days of keynotes, workshops, and networking. Early bird tickets are LIVE.", "target_communities": [f"{category} India Professionals", f"{geography} Tech Leaders", "Startup Founders Network"]},
            {"channel": "Email", "strategy": "4-email drip: announcement → speaker reveal → last chance early bird → final reminder", "message_template": f"Subject: You're invited — {category} Conference {geography} 2026\n\nHi {{name}},\n\nWe're building {geography}'s biggest {category} event of 2026. Join {audience_size}+ peers for 2 days of insights, demos, and connections that matter.\n\nEarly bird tickets: {{link}}\n\nSee you there!", "target_communities": ["Subscriber list", "Partner newsletter swaps", "Alumni networks"]},
            {"channel": "Twitter/X", "strategy": "Countdown posts, speaker spotlights, community hashtag", "message_template": f"Big news 🎉 {category} Conf {geography} is happening! 2 days | 10+ speakers | {audience_size}+ attendees | Early bird open now → link #{category}Conf #{geography}Tech", "target_communities": [f"#{category}Community", f"#{geography}Tech", "#DevCommunity"]},
            {"channel": "WhatsApp/Telegram", "strategy": "Share in existing {category} community groups", "message_template": f"Hey! We're organizing the {category} Conference in {geography}. Early bird tickets available. Would love for you all to join and spread the word!", "target_communities": [f"{category} India groups", f"{geography} Startup Community", "Developer groups"]},
            {"channel": "Reddit", "strategy": "AMA + giveaway approach on relevant subreddits", "message_template": f"We're organizing a {category} conference in {geography} — AMA about the planning + 3 free tickets for active commenters!", "target_communities": ["r/india", "r/startups", "r/learnprogramming", f"r/{category.lower()}"]},
        ],
        "timeline": [
            {"week": "8 weeks before", "action": "Launch announcement across all channels, open early bird tickets"},
            {"week": "6 weeks before", "action": "Speaker announcement wave 1, email blast to all subscribers"},
            {"week": "4 weeks before", "action": "Early bird closes, standard tickets open, social media full push"},
            {"week": "2 weeks before", "action": "Final speaker reveal, FOMO content, partner shoutouts"},
            {"week": "1 week before", "action": "Logistics email to registered attendees, last-minute promo push"},
        ],
        "key_messages": [
            f"The premier {category} conference in {geography}",
            f"Learn directly from top {category} practitioners",
            f"Network with {audience_size}+ professionals in your field",
            "Actionable insights you can implement the next day",
            "Be part of the community shaping the future",
        ],
    }
