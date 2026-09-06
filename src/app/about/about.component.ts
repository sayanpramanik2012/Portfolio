import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID, AfterViewInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { DatapullerService } from '../service/datapuller.service';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-about',
  standalone: false,
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
})
export class AboutComponent implements OnInit, AfterViewInit, OnDestroy {
  skills: any[] = [];
  educations: any[] = [];
  achievements: any[] = [];
  selectedSkill: any = null;
  skillsVisible = false;
  private observer: IntersectionObserver | null = null;
  private isBrowser: boolean;

  leetcodeUsername = 'sayanpramanik2012'; // Replace with your LeetCode username
  URLleetcode = 'https://leetcode.projoracle1.duckdns.org'; // || 'https://alfa-leetcode-api.onrender.com'
  leetcodeData: any = null;
  leetcodeCalendar: any[] = [];
  isLoadingLeetCode = false;
  leetcodeError: string | null = null;

  monthLabels = [
    { month: 'Aug', weekIndex: 0 },
    { month: 'Sep', weekIndex: 4 },
    { month: 'Oct', weekIndex: 9 },
    { month: 'Nov', weekIndex: 13 },
    { month: 'Dec', weekIndex: 17 },
    { month: 'Jan', weekIndex: 22 },
    { month: 'Feb', weekIndex: 26 },
    { month: 'Mar', weekIndex: 30 },
    { month: 'Apr', weekIndex: 35 },
    { month: 'May', weekIndex: 39 },
    { month: 'Jun', weekIndex: 44 },
    { month: 'Jul', weekIndex: 48 },
  ];

  activeSkillCategory: string = 'all';

  categories = [
    { id: 'all', label: 'All Capabilities', icon: 'fas fa-border-all' },
    { id: 'frontend', label: 'Frontend Architecture', icon: 'fab fa-angular' },
    { id: 'servicenow', label: 'Enterprise ServiceNow', icon: 'fas fa-bolt' },
    { id: 'backend', label: 'Backend & APIs', icon: 'fas fa-server' },
    { id: 'devops', label: 'DevOps & Systems', icon: 'fab fa-docker' },
  ];

  constructor(
    private Datapullerservice: DatapullerService,
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    const rawSkills = this.Datapullerservice.getSkills();
    this.skills = rawSkills.map(skill => {
      let category = 'devops';
      let proficiency = 'Advanced';

      const name = (skill.name || '').toLowerCase();
      if (name.includes('angular') || name.includes('typescript') || name.includes('html') || name.includes('css') || name.includes('rxjs') || name.includes('ui/ux') || name.includes('responsive')) {
        category = 'frontend';
        proficiency = (name.includes('angular') || name.includes('typescript')) ? 'Production Core' : 'Advanced';
      } else if (name.includes('servicenow') || name.includes('virtual agent') || name.includes('flow designer')) {
        category = 'servicenow';
        proficiency = 'Enterprise Deployed';
      } else if (name.includes('python') || name.includes('node') || name.includes('rest') || name.includes('mongo') || name.includes('sql') || name.includes('websocket') || name.includes('c#')) {
        category = 'backend';
        proficiency = (name.includes('python') || name.includes('rest')) ? 'Production Core' : 'Proficient';
      } else {
        category = 'devops';
        proficiency = (name.includes('docker') || name.includes('git')) ? 'Daily Driver' : 'Operational';
      }

      return {
        ...skill,
        category,
        proficiency,
      };
    });

    const rawEducations = this.Datapullerservice.getEducations();
    this.educations = rawEducations.map((edu, idx) => {
      let coursework: string[] = [];
      let icon = 'fas fa-graduation-cap';
      if (idx === 0) {
        coursework = ['Data Structures & Algorithms', 'Operating Systems', 'Database Management', 'Object-Oriented Architecture', 'Distributed Systems', 'Computer Networks'];
        icon = 'fas fa-graduation-cap';
      } else if (idx === 1) {
        coursework = ['Physics', 'Chemistry', 'Mathematics', 'Computer Science & C++'];
        icon = 'fas fa-school';
      } else {
        coursework = ['Foundational Mathematics', 'Sciences', 'Computer Applications'];
        icon = 'fas fa-book-open';
      }
      return { ...edu, coursework, icon };
    });

    this.achievements = this.Datapullerservice.getAchievements();
    this.loadLeetCodeData();
  }

  setSkillCategory(category: string): void {
    this.activeSkillCategory = category;
  }

  get filteredSkills(): any[] {
    if (this.activeSkillCategory === 'all') {
      return this.skills;
    }
    return this.skills.filter(s => s.category === this.activeSkillCategory);
  }

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      this.setupSkillsObserver();
      this.setupRevealObserver();
    }
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  private setupSkillsObserver(): void {
    const skillsSection = document.getElementById('skills');
    if (!skillsSection) return;

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.skillsVisible = true;
          }
        });
      },
      { threshold: 0.2 }
    );
    this.observer.observe(skillsSection);
  }

  private setupRevealObserver(): void {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.section-reveal').forEach((el) => {
      revealObserver.observe(el);
    });
  }
  toggleAccordion(achievement: any) {
    achievement.isOpen = !achievement.isOpen;
  }
  openSkillPopup(skill: any) {
    this.selectedSkill = skill;
  }

  closeSkillPopup() {
    this.selectedSkill = null;
  }

  async loadLeetCodeData() {
    this.isLoadingLeetCode = true;
    this.leetcodeError = null;

    try {
      // Load user solved statistics
      const solvedData = await this.fetchLeetCodeSolved();

      // Load user profile data
      const profileData = await this.fetchLeetCodeProfile();

      // Load recent submissions
      const submissionsData = await this.fetchLeetCodeSubmissions();

      // Load calendar data
      const calendarData = await this.fetchLeetCodeCalendar();

      this.leetcodeData = {
        totalSolved: solvedData.solvedProblem || 0,
        easySolved: solvedData.easySolved || 0,
        mediumSolved: solvedData.mediumSolved || 0,
        hardSolved: solvedData.hardSolved || 0,
        totalEasy: solvedData.totalEasy || 0,
        totalMedium: solvedData.totalMedium || 0,
        totalHard: solvedData.totalHard || 0,
        ranking: profileData.ranking || 'N/A',
        acceptanceRate:
          Math.round(
            (solvedData.acSubmissionNum / solvedData.totalSubmissionNum) * 100
          ) || 0,
        recentSubmissions: submissionsData.submission || [],
      };

      this.leetcodeCalendar = this.processCalendarData(calendarData);
    } catch (error) {
      console.error('Error loading LeetCode data:', error);
      this.leetcodeError =
        'Failed to load LeetCode data. Please try again later.';
    } finally {
      this.isLoadingLeetCode = false;
    }
  }

  private async fetchLeetCodeSolved(): Promise<any> {
    const response = await this.http
      .get(`${this.URLleetcode}/${this.leetcodeUsername}/solved`)
      .toPromise();
    return response;
  }

  private async fetchLeetCodeProfile(): Promise<any> {
    const response = await this.http
      .get(`${this.URLleetcode}/${this.leetcodeUsername}`)
      .toPromise();
    return response;
  }

  private async fetchLeetCodeSubmissions(): Promise<any> {
    const response = await this.http
      .get(`${this.URLleetcode}/${this.leetcodeUsername}/submission?limit=10`)
      .toPromise();
    return response;
  }

  private async fetchLeetCodeCalendar(): Promise<any> {
    const response = await this.http
      .get(`${this.URLleetcode}/${this.leetcodeUsername}/calendar`)
      .toPromise();
    return response;
  }

  private processCalendarData(calendarData: any): any[] {
    const processed = [];

    // Parse the nested JSON string first
    let submissionCalendar = {};
    if (calendarData.submissionCalendar) {
      try {
        submissionCalendar = JSON.parse(calendarData.submissionCalendar);
      } catch (error) {
        console.error('Error parsing submission calendar:', error);
        return [];
      }
    }

    // Create a date-to-count mapping for easier lookup
    const dateCountMap: { [date: string]: number } = {};

    // Convert timestamps to date strings
    for (const [timestampStr, count] of Object.entries(submissionCalendar)) {
      const timestamp = parseInt(timestampStr);
      const date = new Date(timestamp * 1000); // Convert to milliseconds
      const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD format
      dateCountMap[dateStr] = count as number;
    }

    // Generate calendar data for the past year
    const currentDate = new Date();
    const yearAgo = new Date(
      currentDate.getFullYear() - 1,
      currentDate.getMonth(),
      currentDate.getDate()
    );

    for (
      let d = new Date(yearAgo);
      d <= currentDate;
      d.setDate(d.getDate() + 1)
    ) {
      const dateStr = d.toISOString().split('T')[0];
      const count = dateCountMap[dateStr] || 0;

      processed.push({
        date: dateStr,
        count: count,
      });
    }

    return processed;
  }

  refreshLeetCodeData() {
    this.loadLeetCodeData();
  }

  formatTimestamp(timestamp: number): string {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  getDifficultyClass(difficulty: string): string {
    return difficulty?.toLowerCase() || 'easy';
  }

  getActivityLevel(count: number): string {
    if (count === 0) return 'level-0';
    if (count <= 2) return 'level-1';
    if (count <= 5) return 'level-2';
    if (count <= 10) return 'level-3';
    return 'level-4';
  }
}
