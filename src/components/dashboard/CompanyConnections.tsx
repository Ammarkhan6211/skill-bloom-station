import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { mockCompanies, Company } from '@/data/mockData';
import { Search, MapPin, Briefcase, Building2, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const CompanyConnections = () => {
  const [companies] = useState<Company[]>(mockCompanies);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>(companies);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [domainFilter, setDomainFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const { toast } = useToast();

  const applyFilters = () => {
    let filtered = companies;

    if (searchTerm) {
      filtered = filtered.filter(company =>
        company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.role.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (roleFilter !== 'all') {
      filtered = filtered.filter(company => company.type === roleFilter);
    }

    if (domainFilter !== 'all') {
      filtered = filtered.filter(company => company.domain === domainFilter);
    }

    if (locationFilter !== 'all') {
      filtered = filtered.filter(company => company.location === locationFilter);
    }

    setFilteredCompanies(filtered);
  };

  React.useEffect(() => {
    applyFilters();
  }, [searchTerm, roleFilter, domainFilter, locationFilter]);

  const handleApply = (company: Company) => {
    toast({
      title: "Application submitted!",
      description: `Your application for ${company.role} at ${company.name} has been submitted.`,
    });
  };

  const uniqueDomains = [...new Set(companies.map(c => c.domain))];
  const uniqueLocations = [...new Set(companies.map(c => c.location))];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Company Connections</h2>
        <p className="text-muted-foreground">Discover job opportunities and internships</p>
      </div>

      {/* Filters */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search & Filter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Input
                placeholder="Search companies or roles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Role Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Job">Full-time Jobs</SelectItem>
                  <SelectItem value="Internship">Internships</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={domainFilter} onValueChange={setDomainFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Domain" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Domains</SelectItem>
                  {uniqueDomains.map(domain => (
                    <SelectItem key={domain} value={domain}>{domain}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {uniqueLocations.map(location => (
                    <SelectItem key={location} value={location}>{location}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Companies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCompanies.map((company) => (
          <Card key={company.id} className="shadow-card hover:shadow-elevated transition-smooth">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{company.logo}</div>
                  <div>
                    <CardTitle className="text-lg">{company.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {company.location}
                    </CardDescription>
                  </div>
                </div>
                <Badge variant={company.type === 'Job' ? 'default' : 'secondary'}>
                  {company.type}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  {company.role}
                </h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {company.description}
                </p>
              </div>
              
              <div>
                <h5 className="text-sm font-medium mb-2">Domain:</h5>
                <Badge variant="outline">{company.domain}</Badge>
              </div>

              <div>
                <h5 className="text-sm font-medium mb-2">Requirements:</h5>
                <div className="flex flex-wrap gap-1">
                  {company.requirements.map((req, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {req}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button 
                  onClick={() => handleApply(company)}
                  className="flex-1 bg-gradient-primary hover:bg-primary-dark transition-smooth"
                >
                  Apply Now
                </Button>
                <Button variant="outline" size="icon">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCompanies.length === 0 && (
        <Card className="shadow-card">
          <CardContent className="text-center py-8">
            <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No companies found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria or filters
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};