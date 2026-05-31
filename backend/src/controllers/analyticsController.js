const Lead = require("../models/Lead");
const Deal = require("../models/Deal");
const Project = require("../models/Project");
const Task = require("../models/Task");

const getSummary = async (req, res) => {
  try {
    const [leads, deals, projects, tasks] = await Promise.all([
      Lead.find(),
      Deal.find(),
      Project.find(),
      Task.find()
    ]);

    const totalRevenue = deals.filter(d => d.stage === "won").reduce((sum, d) => sum + (d.value || 0), 0);
    const pendingRevenue = deals.filter(d => d.stage !== "won" && d.stage !== "lost").reduce((sum, d) => sum + (d.value || 0), 0);

    const completedProjects = projects.filter(p => p.status === "Completed").length;
    const projectProgress = projects.length > 0 ? Math.round((completedProjects / projects.length) * 100) : 0;

    res.status(200).json({
      success: true,
      summary: {
        leadsCount: leads.length,
        dealsCount: deals.length,
        totalRevenue,
        pendingRevenue,
        projectsCount: projects.length,
        projectProgress,
        tasksCount: tasks.length,
        completedTasks: tasks.filter(t => t.status === "done").length
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const handleAIChat = async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ message: "Prompt is required" });

    // Retrieve database stats to construct a context-aware response
    const [leads, deals, projects, tasks] = await Promise.all([
      Lead.find(),
      Deal.find(),
      Project.find(),
      Task.find()
    ]);

    const totalRevenue = deals.filter(d => d.stage === "won").reduce((sum, d) => sum + (d.value || 0), 0);
    const openDeals = deals.filter(d => d.stage !== "won" && d.stage !== "lost");
    const activeTasks = tasks.filter(t => t.status !== "done");

    // Standard high-quality AI simulated responses
    let aiResponse = "";
    const lowerPrompt = prompt.toLowerCase();

    if (lowerPrompt.includes("status") || lowerPrompt.includes("summary") || lowerPrompt.includes("report")) {
      aiResponse = `Based on your live CRM database, here is the current health report:
- **Sales Conversion**: You have successfully won **$${totalRevenue.toLocaleString()}** in closed deals. There are **${openDeals.length}** active deals still in negotiation.
- **Leads Funnel**: There are **${leads.length}** registered leads in your pipeline.
- **Delivery Timeline**: There are **${projects.length}** active projects, with **${activeTasks.length}** outstanding tasks assigned to the engineering team.
*Recommendation*: Focus on qualified leads to push the pending pipeline to closed-won.`;
    } else if (lowerPrompt.includes("convert") || lowerPrompt.includes("sales") || lowerPrompt.includes("deal")) {
      aiResponse = `Here is an action plan to optimize your conversion pipeline:
1. **Accelerate Lead Response**: Contact new leads within the first hour of submission.
2. **Follow Up Regularly**: Follow-ups are key to closing active deals in the proposal stage.
3. **Analyze Won Deals**: Review the recent $${totalRevenue.toLocaleString()} won deals to find common attributes and replicate the successful approach.`;
    } else if (lowerPrompt.includes("task") || lowerPrompt.includes("project") || lowerPrompt.includes("timeline")) {
      aiResponse = `Analyzing active project deliverables:
- Currently tracking **${projects.length}** projects.
- **${activeTasks.length}** outstanding tasks require immediate team focus.
- *Risk assessment*: Ensure task priority lists are up to date in the Task Kanban to prevent bottlenecks in development stages.`;
    } else {
      aiResponse = `Hello! I am your CODEXA AI CRM Assistant. I am analyzing your workspace. Currently you have:
- **${leads.length} Leads** in CRM
- **$${totalRevenue.toLocaleString()} Closed Revenue**
- **${projects.length} Active Projects**

Let me know if you would like me to summarize your sales pipeline, list high-priority tasks, or recommend steps to improve conversion rate!`;
    }

    res.status(200).json({ success: true, response: aiResponse });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getSummary, handleAIChat };
