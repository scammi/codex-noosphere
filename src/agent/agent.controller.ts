import { AiExtractorService } from './agent.service';
import { Controller, Post, Body } from '@nestjs/common';

@Controller('agent')
export class AgentController {
  constructor(private aiExtractorService: AiExtractorService) {}

  @Post('test')
  async testExtraction(@Body() body: { text: string; template?: string }) {
    const { text, template = 'simple' } = body;

    const result = await this.aiExtractorService.extractMetadata(
      text,
      template as any,
    );

    return {
      success: true,
      data: result,
      message: 'Extraction completed',
    };
  }

  @Post('test-sample')
  async testWithSample() {
    const sampleText = `
      UNESCO World Heritage Site Documentation
      
      The Angkor Archaeological Park in Siem Reap, Cambodia represents one of the most 
      significant archaeological sites in Southeast Asia. This cultural heritage 
      site encompasses the remains of the different capital cities of the Khmer 
      Empire from the 9th to the 15th century.
      
      The site includes the famous Angkor Wat temple complex, built in the early 
      12th century during the reign of King Suryavarman VII. The complex covers 
      an area of over 400 square kilometers and contains magnificent examples of 
      Khmer architecture.
      
      Conservation efforts led by UNESCO and the Cambodian government are ongoing 
      to preserve these ancient monuments for future generations. The site faces 
      challenges from tourism pressure, environmental factors, and the need for 
      sustainable preservation techniques.
      
      Key monuments include:
      - Angkor Wat temple complex
      - Bayon Temple in Angkor Thom
      - Ta Prohm temple
      - Banteay Srei temple
      
      The site was inscribed on the UNESCO World Heritage List in 1992 and 
      attracts over 2 million visitors annually.
    `;

    const result = await this.aiExtractorService.extractMetadata(sampleText);

    return {
      success: true,
      data: result,
      message: 'Sample extraction completed',
      input_length: sampleText.length,
    };
  }
}
