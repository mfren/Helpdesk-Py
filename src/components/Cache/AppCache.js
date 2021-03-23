
export default class AppCache {
    constructor(props) {
        this.props = props
        this.cache = {
            reports: null,
        }
    }
    
    cacheReports(value) {
        this.cache.reports = value
    }
    
    reports() {
        return this.cache.reports
    }

    getReport(uid) {
        if (this.cache.reports !== null) {            // Catch a non-existent cache
            if (this.cache.reports.val() !== null) {  // Catch no data in database
                for (const [key, val] of Object.entries(this.cache.reports.val())) {
                    if (key === uid) {
                        return val
                    }
                }
            }
        }
        return null;
    }
}